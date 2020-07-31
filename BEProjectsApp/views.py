import json

from .models import Project, Teacher, Contributor, User, DOMAIN_CHOICES
from .serializers import (
    ProjectSerializer,
    TeacherSerializer,
    TeacherSerializer1,
    ContributorSerializer,
    UserSerializer,
    LoginSerializer,
    AllProjectSerializer,
    UpdateProjectSerializer,
    UpdateProjectReportSerializer,
)
from .permissions import IsUserOrReadOnly, Permit
from .filters import BrowseProjectFilter, ProjectFilter

from rest_framework import generics, status, viewsets, mixins, filters, serializers
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login
from django.http import JsonResponse, HttpResponse, QueryDict
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
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
    serializer_class = TeacherSerializer1
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["user__first_name", "user__last_name", "subject"]
    permission_classes = (IsUserOrReadOnly, IsAuthenticatedOrReadOnly)


class ContributorViewSet(viewsets.ModelViewSet):
    queryset = Contributor.objects.all()
    serializer_class = ContributorSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = [
        "user__username",
        "user__first_name",
        "user__last_name",
        "user__email",
        "year",
        "division",
    ]


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
        username = request.data["username"]
        password = request.data["password"]
        user = authenticate(request, username=username, password=password)

        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)

            login(request, user)

            if user.is_teacher:
                role = "Teacher"
            elif user.is_contributor:
                role = "Contributor/Student"

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
        try:
            project = Project.objects.get(id=pk)
            serializer = UpdateProjectSerializer(
                project, data=request.data, partial=True
            )

            if serializer.is_valid():
                serializer.save()
                return JsonResponse(
                    data=dict(
                        {"Message": "Successfully updated Project"}, **serializer.data
                    ),
                    status=status.HTTP_200_OK,
                )
            else:
                print(serializer.errors)
                return JsonResponse(
                    data={"Message": "Error updating Project"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        except Exception as e:
            print(e)
            return JsonResponse(
                data={"Message": "Internal Server Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UpdateUser(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [Permit]

    def put(self, request):
        try:
            if request.user.is_teacher:
                user = Teacher.objects.get(user=request.user)
                serializer = TeacherSerializer1(user, data=request.data, partial=True)
            elif request.user.is_contributor:
                user = Contributor.objects.get(user=request.user)
                serializer = ContributorSerializer(
                    user, data=request.data, partial=True
                )

            if serializer and serializer.is_valid():
                serializer.save()
                return JsonResponse(
                    data=dict(
                        {"Message": "Successfully updated User"}, **serializer.data
                    ),
                    status=status.HTTP_200_OK,
                )
            else:
                return JsonResponse(
                    data={"Message": "Error updating User"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        except Exception as e:
            print(e)
            return JsonResponse(
                data={"Message": "Internal Server Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_serializer_class(self):
        if self.request.user.is_authenticated:
            if self.request.user.is_teacher:
                return TeacherSerializer1
            elif self.request.user.is_contributor:
                return ContributorSerializer


class CreateProject(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [Permit]

    def post(self, request):
        try:
            title = request.POST.get("title", None)
            teacher_id = request.POST.get("teacher", None)
            contributor_ids = request.POST.getlist("contributors[]", None)
            description = request.POST.get("description", None)
            abstract = request.POST.get("abstract", None)
            domain = request.POST.get("domain", None)
            github_repo = request.POST.get("github_repo", None)
            demo_video = request.POST.get("demo_video", None)
            awards = request.POST.get("awards", None)
            journal = request.POST.get("journal", None)
            is_inhouse = (
                True if request.POST.get("is_inhouse", None) == "True" else False
            )
            company = request.POST.get("company", None)
            supervisor = request.POST.get("supervisor", None)
            report = request.FILES.get("report", None)
            executable = request.FILES.get("executable", None)

            teacher = Teacher.objects.get(user__id=teacher_id)
            contributors = [
                Contributor.objects.get(user__id=contributor_id)
                for contributor_id in contributor_ids
            ]

            project = Project(
                title=title,
                teacher=teacher,
                description=description,
                abstract=abstract,
                domain=domain,
                report=report,
                executable=executable,
                github_repo=github_repo,
                demo_video=demo_video,
                awards=awards,
                journal=journal,
                is_inhouse=is_inhouse,
                company=company,
                supervisor=supervisor,
            )
            project.save()

            for contributor in contributors:
                project.contributors.add(contributor)

            return JsonResponse(
                data={"Message": "Successfully created Project"},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            print(e)
            return JsonResponse(
                data={"Message": "Internal Server Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_serializer_class(self):
        return ProjectSerializer


class UpdateProjectReport(generics.GenericAPIView):
    def put(self, request, pk):
        project = Project.objects.get(id=pk)
        serilaizer = UpdateProjectReportSerializer(project, data=request.data)

        if serilaizer.is_valid():
            serilaizer.save()
            return JsonResponse(
                data={"Message": "Successfully update Project Report"},
                status=status.HTTP_200_OK,
            )
        else:
            print(serializer.errors)
            return JsonResponse(
                data={"Message": "Error updating Project Report"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
