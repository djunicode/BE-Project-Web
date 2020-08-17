import json

from .models import *
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
    ChangePasswordSerializer,
)
from .permissions import IsUserOrReadOnly, Permit
from .filters import BrowseProjectFilter, ProjectFilter

from rest_framework import generics, status, viewsets, mixins, filters, serializers
from django.contrib.auth import authenticate, login
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.http import JsonResponse, HttpResponse, QueryDict
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q


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


@permission_classes([IsAuthenticatedOrReadOnly])
@api_view(["POST"])
def change_password(request):
    user = authenticate(
        username=request.user.username, password=request.POST.get("current_password")
    )
    if not user:
        return JsonResponse(
            data={"message": "Wrong password provided"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    serializer = ChangePasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    request.user.set_password(serializer.validated_data["new_password"])
    request.user.save()
    return JsonResponse(
        data={"message": "Successfully changed password"},
        status=status.HTTP_204_NO_CONTENT,
    )


@permission_classes([IsAuthenticatedOrReadOnly])
@api_view(["GET"])
def get_domains(request):
    if request.method == "GET":
        domains = [domain[0] for domain in DOMAIN_CHOICES]
        return Response(domains)
    else:
        return JsonResponse(
            data={"Message": "Only GET request allowed"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
def account_login(request):
    if request.method == "POST":
        try:
            username = request.data.get("username", None)
            password = request.data.get("password", None)
            user = authenticate(request, username=username, password=password)

            if user is not None:
                token, _ = Token.objects.get_or_create(user=user)

                login(request, user)

                data = {
                    "Name": user.first_name + " " + user.last_name,
                    "id": user.pk,
                    "Username": user.username,
                    "Token": token.key,
                }

                if user.is_teacher:
                    role = "Teacher"
                    subject = user.teacher_user.subject
                    data.update({"Designation": role, "Subject": subject})
                elif user.is_contributor:
                    role = "Contributor/Student"
                    github_id = user.contributor_user.github_id
                    division = user.contributor_user.division
                    year = user.contributor_user.year
                    data.update(
                        {
                            "Designation": role,
                            "github_id": github_id,
                            "Division": division,
                            "Year": year,
                        }
                    )

                return JsonResponse(data, status=status.HTTP_200_OK)

            else:
                data = {"Message": "There was error authenticating"}
                return JsonResponse(data, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return JsonResponse(
                data={"Message": "Internal Server Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    else:
        return JsonResponse(
            data={"Message": "Only POST request allowed"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
@api_view(["POST"])
def approve_project(request):
    if request.method == "POST":
        try:
            if request.user.is_teacher:
                pk = request.data["pk"]
                try:
                    project = Project.objects.get(id=pk)
                    project.publish()
                    data = {"flag": 1, "Message": "Successfully approved Project"}
                    return JsonResponse(data, status=status.HTTP_200_OK)
                except:
                    data = {"flag": 0, "Message": "Project does not exist"}
                    return JsonResponse(data, status=status.HTTP_400_BAD_REQUEST)
            else:
                return JsonResponse(
                    {"Message": "You are not authorized to perform this action"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
        except Exception as e:
            print(e)
            return JsonResponse(
                data={"Message": "Internal Server Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    else:
        return JsonResponse(
            data={"Message": "Only POST request allowed"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
@api_view(["POST"])
def delete_project(request):
    if request.method == "POST":
        try:
            pk = request.data["pk"]
            project = Project.objects.get(id=pk)
            project.delete()
            data = {"Message": "Successfully deleted Project"}
            return JsonResponse(data, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return JsonResponse(
                data={"Message": "Internal Server Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    else:
        return JsonResponse(
            data={"Message": "Only POST request allowed"},
            status=status.HTTP_400_BAD_REQUEST,
        )


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

    def get_serializer_class(self):
        return ProjectSerializer


class BrowseProjects(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request):

        print(request.user.is_authenticated)
        u = request.user

        print(request.auth)
        if request.auth == None:
            print("0")
            filter1 = ProjectFilter(request.GET, queryset=Project.objects.all())
            AllProjects = ProjectSerializer(filter1.qs, many=True).data
            return JsonResponse(AllProjects, status=status.HTTP_200_OK, safe=False)

        else:
            if request.user.is_teacher == True:
                print("1")

                filter1 = ProjectFilter(request.GET, queryset=Project.objects.all())
                # A = ProjectSerializer(filter1.qs, many=True).data

                AllProjects = AllProjectSerializer(filter1.qs, many=True).data

                return JsonResponse(AllProjects, status=status.HTTP_200_OK, safe=False)
            else:
                print("-1")
                filter1 = ProjectFilter(request.GET, queryset=Project.objects.all())
                A = ProjectSerializer(filter1.qs, many=True).data

                return JsonResponse(A, status=status.HTTP_200_OK, safe=False)


class MyProjectSearch(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [Permit]

    def get(self, request, query):
        if request.user.is_contributor:
            c = Contributor.objects.get(user=request.user)
            p = Project.objects.filter(contributors=c)
            q = query.split(" ")
            for query in q:
                p = p.filter(
                    Q(description__icontains=query)
                    | Q(abstract__icontains=query)
                    | Q(teacher__user__username__icontains=query)
                    | Q(contributors__user__username__icontains=query)
                    | Q(title__icontains=query)
                    | Q(awards__icontains=query)
                    | Q(contributors__user__first_name__icontains=query)
                    | Q(teacher__user__first_name__icontains=query)
                    | Q(contributors__user__last_name__icontains=query)
                    | Q(teacher__user__last_name__icontains=query)
                ).distinct()
            l = list(set(p))
            data = ProjectSerializer(l, many=True).data
            return JsonResponse(data, safe=False)
        else:
            t = Teacher.objects.get(user=request.user)
            p = Project.objects.filter(teacher=t)
            q = query.split(" ")
            for query in q:
                p = p.filter(
                    Q(description__icontains=query)
                    | Q(abstract__icontains=query)
                    | Q(teacher__user__username__icontains=query)
                    | Q(contributors__user__username__icontains=query)
                    | Q(title__icontains=query)
                    | Q(awards__icontains=query)
                    | Q(contributors__user__first_name__icontains=query)
                    | Q(teacher__user__first_name__icontains=query)
                    | Q(contributors__user__last_name__icontains=query)
                    | Q(teacher__user__last_name__icontains=query)
                ).distinct()
            l = list(set(p))
            data = AllProjectSerializer(l, many=True).data
            return JsonResponse(data, safe=False)


class Search(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request, query):
        print(query)
        if request.auth == None:

            q = query.split(" ")
            p = Project.objects.filter(approved=True)
            for query in q:
                p = p.filter(
                    Q(description__icontains=query)
                    | Q(abstract__icontains=query)
                    | Q(teacher__user__username__icontains=query)
                    | Q(contributors__user__username__icontains=query)
                    | Q(title__icontains=query)
                    | Q(awards__icontains=query)
                    | Q(contributors__user__first_name__icontains=query)
                    | Q(teacher__user__first_name__icontains=query)
                    | Q(contributors__user__last_name__icontains=query)
                    | Q(teacher__user__last_name__icontains=query)
                ).distinct()
            l = list(set(p))
            data = ProjectSerializer(l, many=True).data
            return JsonResponse(data, safe=False)
        else:
            if request.user.is_teacher == True:
                print(1)
                q = query.split(" ")
                p=Project.objects.filter(approved=True)
                for query in q:
                    p = p.objects.filter(
                        Q(description__icontains=query)
                        | Q(abstract__icontains=query)
                        | Q(teacher__user__username__icontains=query)
                        | Q(contributors__user__username__icontains=query)
                        | Q(title__icontains=query)
                        | Q(awards__icontains=query)
                        | Q(contributors__user__first_name__icontains=query)
                        | Q(teacher__user__first_name__icontains=query)
                        | Q(contributors__user__last_name__icontains=query)
                        | Q(teacher__user__last_name__icontains=query)
                    ).distinct()
                l = list(set(p))
                data = AllProjectSerializer(l, many=True).data
                return JsonResponse(data, safe=False)
            else:
                print("-1")
                q = query.split(" ")
                p = Project.objects.filter(approved=True)
                for query in q:
                    p = p.objects.filter(
                        Q(description__icontains=query)
                        | Q(abstract__icontains=query)
                        | Q(teacher__user__username__icontains=query)
                        | Q(contributors__user__username__icontains=query)
                        | Q(title__icontains=query)
                        | Q(awards__icontains=query)
                        | Q(contributors__user__first_name__icontains=query)
                        | Q(teacher__user__first_name__icontains=query)
                        | Q(contributors__user__last_name__icontains=query)
                        | Q(teacher__user__last_name__icontains=query)
                    ).distinct()
                l = list(set(p))
                data = ProjectSerializer(l, many=True).data
                return JsonResponse(data, safe=False)


@authentication_classes([TokenAuthentication])
@permission_classes([Permit])
@api_view(["GET"])
def my_projects(request):
    if request.method == "GET":
        try:
            if request.user.is_teacher == True:
                teacher = Teacher.objects.get(user=request.user)
                teacher_projects = Project.objects.filter(teacher=teacher)
                filtered_projects = ProjectFilter(
                    request.GET, queryset=teacher_projects
                )
                my_projects = AllProjectSerializer(filtered_projects.qs, many=True).data
            else:
                contributor = Contributor.objects.get(user=request.user)
                contributor_projects = Project.objects.filter(contributors=contributor)
                filtered_projects = ProjectFilter(
                    request.GET, queryset=contributor_projects
                )
                my_projects = AllProjectSerializer(filtered_projects.qs, many=True).data
            return JsonResponse(my_projects, status=status.HTTP_200_OK, safe=False)

        except Exception as e:
            print(e)
            return JsonResponse(
                data={"Message": "Internal Server Error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    else:
        return JsonResponse(
            data={"Message": "Only GET request allowed"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@authentication_classes([TokenAuthentication])
@permission_classes([Permit])
@api_view(["PUT"])
def update_project(request, pk):
    if request.method == "PUT":
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
    else:
        return JsonResponse(
            data={"Message": "Only PUT request allowed"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@authentication_classes([TokenAuthentication])
@permission_classes([Permit])
@api_view(["PUT"])
def update_user(request):
    if request.method == "PUT":
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
    else:
        return JsonResponse(
            data={"Message": "Only PUT request allowed"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@authentication_classes([TokenAuthentication])
@permission_classes([Permit])
@api_view(["POST"])
def create_project(request):
    if request.method == "POST":
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
            year_created = request.POST.get("year_created", None)
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
                year_created=year_created,
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
    else:
        return JsonResponse(
            data={"Message": "Only POST request allowed"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@authentication_classes([TokenAuthentication])
@permission_classes([Permit])
@api_view(["PUT"])
def update_project_report(request, pk):
    if request.method == "PUT":
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
    else:
        return JsonResponse(
            data={"Message": "Only PUT request allowed"},
            status=status.HTTP_400_BAD_REQUEST,
        )
