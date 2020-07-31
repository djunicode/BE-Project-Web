from .models import Project, Teacher, Contributor, DOMAIN_CHOICES
from .serializers import (
    ProjectSerializer,
    TeacherSerializer,
    ContributorSerializer,
    UserSerializer,
    LoginSerializer,
    AllProjectSerializer,
    UpdateProjectSerializer,
    UpdateProjectReportSerializer
)
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework import generics, status, viewsets, mixins, filters, serializers
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.http import JsonResponse, HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view
from .permissions import IsUserOrReadOnly
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
import json
from django.shortcuts import get_object_or_404
from .permissions import Permit
from django.http import QueryDict
from .filters import BrowseProjectFilter, ProjectFilter


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    # import pdb; pdb.set_trace()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = [
        "company",
        "supervisor",
        "domain",
        "is_inhouse",
        "approved",
        "year_created",
        "title",
        "teacher",
    ]


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["subject"]
    permission_classes = (IsUserOrReadOnly, IsAuthenticatedOrReadOnly)


class ContributorViewSet(viewsets.ModelViewSet):
    queryset = Contributor.objects.all()
    serializer_class = ContributorSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["name", "last_name", "email"]


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


class CreateProjectWithContributors(generics.GenericAPIView):
    def post(self, request):
        try:
            print(request.data)
            data = request.data
            print(json.loads(data["project"]))
            proj = json.loads(data["project"])
            print(json.loads(data["contributors"]))
            cont = json.loads(data["contributors"])
            try:
                teacher = Teacher.objects.get(pk=proj["teacher"])
            except:
                return JsonResponse(
                    {"Message": "Teacher id not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            # teacher = get_object_or_404(Teacher,pk=proj["teacher"])
            print(data["document"])
            project = Project(
                title=proj["title"],
                teacher=teacher,
                description=proj["description"],
                year_created=proj["year_created"],
                document=data["document"],
                domain=proj["domain"],
                approved=proj["approved"],
                is_inhouse=proj["is_inhouse"],
                company="" if proj["is_inhouse"] else proj["company"],
                supervisor="" if proj["is_inhouse"] else proj["supervisor"],
            )
            print(project)
            project.save()
            for contributor in cont:
                contributor_var = Contributor(
                    name=contributor["name"],
                    last_name=contributor["last_name"],
                    email=contributor["email"],
                    project=project,
                )
                contributor_var.save()
        except Exception as e:
            print(e)
            return JsonResponse({"Message": "error"}, status.HTTP_400_BAD_REQUEST)
        return JsonResponse({"Message": "Success"}, status=status.HTTP_201_CREATED)

    def get_serializer_class(self):
        return ProjectSerializer


class Approve(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request):
        print(request.user)

        pk = request.data["pk"]
        print(pk)
        try:
            p = Project.objects.get(id=pk)

            p.publish()
            data = {"flag": 1, "Message": "ok"}
            return JsonResponse(data, status=status.HTTP_200_OK)
        except:
            data = {"flag": 0, "Message": "No such Project exists"}
            return JsonResponse(data, status=status.HTTP_400_BAD_REQUEST)


class Login(generics.GenericAPIView):
    def post(self, request):
        Username = request.data["username"]
        Password = request.data["password"]
        user = authenticate(request, username=Username, password=Password)

        if user is not None:

            token, _ = Token.objects.get_or_create(user=user)
            print(token.key)

            login(request, user)

            if user.is_teacher:
                Role = "Teacher"
            else:
                Role = "Contributor/Student"
            data = {
                "Name": user.first_name + " " + user.last_name,
                "id": user.pk,
                "Username": user.username,
                "Token": token.key,
                "Designation": Role,
            }
            return JsonResponse(data, status=status.HTTP_200_OK)

        else:
            data = {"Message": "There was error authenticating"}
            return JsonResponse(data, status=status.HTTP_400_BAD_REQUEST)


class Delete_Project(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request):
        pk = request.data["pk"]
        p = Project.objects.get(id=pk)
        try:
            p.delete()
            data = {"Message": "Successfully Deleted"}
            return JsonResponse(data, status=status.HTTP_200_OK)
        except:
            data = {"Message": "Error deleteing project"}
            return JsonResponse(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProjectsView(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        print(request.user)
        u = request.user

        print(request.auth)
        if request.auth == None:
            print(request.user)
            AllProjects = ProjectSerializer(Project.objects.all(), many=True).data
            return JsonResponse(AllProjects, status=status.HTTP_200_OK, safe=False)

        else:
            if request.user.is_teacher == True:
                print("1")
                t = Teacher.objects.get(user=request.user)
                k = Project.objects.filter(teacher=t)
                A = Project.objects.all()

                print(k.values())
                myProjects = ProjectSerializer(k, many=True).data
                AllProjects = ProjectSerializer(A, many=True).data
                data = {"MyProjects": myProjects, "AllProjects": AllProjects}

                return JsonResponse(data, status=status.HTTP_200_OK, safe=False)
            else:
                print("0")
                c = Contributor.objects.get(user=request.user)
                k = Project.objects.filter(contributors=c)

                myProjects = ProjectSerializer(k, many=True).data
                AllProjects = ProjectSerializer(Project.objects.all(), many=True).data
                data = {"MyProjects": myProjects, "AllProjects": AllProjects}

                return JsonResponse(data, status=status.HTTP_200_OK, safe=False)


class BrowseProjects(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request):

        print(request.user)
        u = request.user

        print(request.auth)
        if request.auth == None:

            filter1 = ProjectFilter(request.GET, queryset=Project.objects.all())
            AllProjects = ProjectSerializer(filter1.qs, many=True).data
            return JsonResponse(AllProjects, status=status.HTTP_200_OK, safe=False)

        else:
            if request.user.is_teacher == True:
                print("1")

                filter1 = ProjectFilter(request.GET, queryset=Project.objects.all())
                A = ProjectSerializer(filter1.qs, many=True).data

                AllProjects = AllProjectSerializer(A, many=True).data

                return JsonResponse(AllProjects, status=status.HTTP_200_OK, safe=False)
            else:
                print("1")
                filter1 = ProjectFilter(request.GET, queryset=Project.objects.all())
                A = ProjectSerializer(filter1.qs, many=True).data

                return JsonResponse(A, status=status.HTTP_200_OK, safe=False)


class MyProjects(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [Permit]

    def get(self, request):
        if request.user.is_teacher == True:
            print("1")
            t = Teacher.objects.get(user=request.user)
            k = Project.objects.filter(teacher=t)
            filter1 = ProjectFilter(request.GET, queryset=k)
            myProjects = AllProjectSerializer(filter1.qs, many=True).data

            return JsonResponse(myProjects, status=status.HTTP_200_OK, safe=False)
        else:
            c = Contributor.objects.get(user=request.user)

            k = Project.objects.filter(contributors=c)
            filter1 = ProjectFilter(request.GET, queryset=k)
            myProjects = AllProjectSerializer(filter1.qs, many=True).data

            return JsonResponse(myProjects, status=status.HTTP_200_OK, safe=False)


class UpdateProject(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [Permit]

    def put(self, request, pk):
        u = request.user
        print(pk)
        p = Project.objects.get(id=pk)
        print(request.data)

        serializer = UpdateProjectSerializer(p, data=request.data, partial=True)

        if serializer.is_valid():
            print(serializer.errors)
            serializer.save()
            return JsonResponse("ok", safe=False)
        else:
            print(serializer.errors)
            return JsonResponse("error", safe=False)


class UpdateProjectReport(generics.GenericAPIView):
    def put(self,request,pk):
        p=Project.objects.get(id=pk)
        serilaizer=UpdateProjectReportSerializer(p,data=request.data)
        if serilaizer.is_valid():
            serilaizer.save()
            return JsonResponse("ok", safe=False)
        else:
            print(serializer.errors)
            return JsonResponse("error", safe=False)





