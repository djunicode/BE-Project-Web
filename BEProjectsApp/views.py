from BEProjectsApp.models import Project, TeacherProfile, Contributor, DOMAIN_CHOICES
from BEProjectsApp.serializers import (
    ProjectSerializer,
    TeacherSerializer,
    ContributorSerializer,
    UserSerializer,
    LoginSerializer,
)
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework import viewsets, mixins
from rest_framework import filters
from rest_framework import serializers
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.http import JsonResponse, HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view
from .permissions import IsUserOrReadOnly
from rest_framework.views import APIView


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    # import pdb; pdb.set_trace()
    filterset_fields = (
        "company",
        "supervisor",
        "domain",
        "is_inhouse",
        "approved",
        "year_created",
        "title",
        "teacher__user__username",
    )


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = TeacherProfile.objects.all()
    serializer_class = TeacherSerializer
    filterset_fields = ("subject",)
    permission_classes = (IsUserOrReadOnly, IsAuthenticatedOrReadOnly)


class ContributorViewSet(viewsets.ModelViewSet):
    queryset = Contributor.objects.all()
    serializer_class = ContributorSerializer
    filterset_fields = ("name", "last_name", "email")


class SearchProjectView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get(self, request):
        count = []
        SearchResult = []

        search = request.query_params["generic"]

        # Get the required projects  based on search
        projects = Project.objects.filter(title__startswith=search)
        contributors = Contributor.objects.filter(name__startswith=search)

        context = {"request": request}

        # Count the total number of search results
        count.append({"ProjectCount": projects.count()})
        # count.append({"ContributorCount": contributors.count()})

        projects = (ProjectSerializer(projects, many=True, context=context)).data

        contributors = (
            ContributorSerializer(contributors, many=True, context=context)
        ).data

        # Sort in ascending order of project titles
        projects = sorted(projects, key=lambda k: k["title"])

        labels = ["count", "projects", "contributors"]

        Result = [count, projects, contributors]

        for indx, label in enumerate(labels):
            SearchResult.append({label: Result[indx]})

        return Response(SearchResult)


class GetDomainView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get(self, request):
        domains = [domain[0] for domain in DOMAIN_CHOICES]
        return Response(domains)


class Approve(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def post(self, request):
        pk = request.data["pk"]
        print(pk)
        try:
            p = Project.objects.get(id=pk)

            p.approved = True
            p.save()
            data = {"flag": 1, "Message": "ok"}
            return JsonResponse(data, status=status.HTTP_200_OK)
        except:
            data = {"flag": 0, "Message": "No such Project exists"}
            return JsonResponse(data, status=status.HTTP_400_BAD_REQUEST)
