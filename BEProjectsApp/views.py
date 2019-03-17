from BEProjectsApp.models import Project, TeacherProfile, Contributor
from BEProjectsApp.serializers import (
    ProjectSerializer,
    TeacherSerializer,
    ContributorSerializer,
    UserSerializer,
    LoginSerializer,
)
from rest_framework import viewsets
from rest_framework import filters
from rest_framework import serializers
from django.contrib.auth.models import User
from django.http import HttpResponse

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .permissions import IsUserOrReadOnly


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filterset_fields = (
        "company",
        "supervisor",
        "domain",
        "is_inhouse",
        "approved",
        "year_created",
        "title",
        "teacher",
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
