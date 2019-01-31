from .models import Inhouse_Project, Teacher, Outhouse_Project
from .serializers import (
    InhouseProjectSerializer,
    TeacherSerializer,
    OuthouseProjectSerializer,
)
from rest_framework import viewsets
from rest_framework import filters
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_multiple_model.viewsets import FlatMultipleModelAPIViewSet


class InhouseProjectViewSet(viewsets.ModelViewSet):
    queryset = Inhouse_Project.objects.all()
    serializer_class = InhouseProjectSerializer


class OuthouseProjectViewSet(viewsets.ModelViewSet):
    queryset = Outhouse_Project.objects.all()
    serializer_class = OuthouseProjectSerializer


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer


# class AllProjectsView(FlatMultipleModelAPIViewSet):
#     sorting_fields = ['type','title']
#     querylist = [
#         {
#             'queryset' : Inhouse_Project.objects.all(),
#             'serializer_class' : InhouseProjectSerializer,
#             'label' : 'InhouseProject',
#         },
#         {
#             'queryset' : Outhouse_Project.objects.all(),
#             'serializer_class' : OuthouseProjectSerializer,
#             'label' : 'OuthouseProject',
#         },

#     ]
#     filter_backends = (filters.SearchFilter,)
#     search_fields = ('$title',)


class SearchProjectView(APIView):
    def get(self, request):
        count = []
        # Get the required projects  based on search
        inhouse = Inhouse_Project.objects.filter(
            title__startswith=request.query_params["name"]
        )
        outhouse = Outhouse_Project.objects.filter(
            title__startswith=request.query_params["name"]
        )

        context = {"request": request}

        # Count the total number of search results
        count.append({"count": inhouse.count() + outhouse.count()})

        inhouse_serializer = InhouseProjectSerializer(
            inhouse, many=True, context=context
        )
        outhouse_serializer = OuthouseProjectSerializer(
            outhouse, many=True, context=context
        )

        inhouse_projects = inhouse_serializer.data
        outhouse_projects = outhouse_serializer.data

        # Add type to each project i.e. inhouse and outhouse
        for projects in inhouse_projects:
            projects.update({"type": "Inhouse_Projects"})

        for projects in outhouse_projects:
            projects.update({"type": "Outhouse_Projects"})

        # Sort in ascending order of project titles
        inhouse_projects = sorted(inhouse_projects, key=lambda k: k["title"])
        outhouse_projects = sorted(outhouse_projects, key=lambda k: k["title"])

        # combine inhouse, outhouse and count
        projects = inhouse_projects + outhouse_projects + count
        return Response(projects)
