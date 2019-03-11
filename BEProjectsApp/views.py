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
import re

# import rest_framework
# print(rest_framework.VERSION)


class InhouseProjectViewSet(viewsets.ModelViewSet):
    queryset = Inhouse_Project.objects.all()
    serializer_class = InhouseProjectSerializer


class OuthouseProjectViewSet(viewsets.ModelViewSet):
    queryset = Outhouse_Project.objects.all()
    serializer_class = OuthouseProjectSerializer


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer


class SearchProjectView(APIView):
    def get(self, request):
        count = []
        contributors = []
        search = request.query_params["name"]
        regex = r"^" + search.lower() + r""

        # Get the required projects  based on search
        inhouse = Inhouse_Project.objects.filter(title__startswith=search)
        outhouse = Outhouse_Project.objects.filter(title__startswith=search)

        contributers1 = Inhouse_Project.objects.filter(contributers__contains=search)
        contributers2 = Outhouse_Project.objects.filter(contributers__contains=search)

        context = {"request": request}

        # Count the total number of search results
        count.append({"count": inhouse.count() + outhouse.count()})

        inhouse_serializer = InhouseProjectSerializer(
            inhouse, many=True, context=context
        )
        outhouse_serializer = OuthouseProjectSerializer(
            outhouse, many=True, context=context
        )

        contributers1 = (
            InhouseProjectSerializer(contributers1, many=True, context=context)
        ).data
        contributers2 = (
            OuthouseProjectSerializer(contributers2, many=True, context=context)
        ).data

        # Get the list of contributors using the function
        contributers1 = self.findContributers(contributers1, regex)
        contributers2 = self.findContributers(contributers2, regex)
        contributors.append(contributers1 + contributers2)

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
        projects = inhouse_projects + outhouse_projects + count + contributors
        return Response(projects)

    def findContributers(self, contributors, regex):
        names = []

        for obj in contributors:
            list1 = (obj["contributers"].replace(" ", "")).split(",")
            for contributor in list1:
                if re.search(regex, contributor.lower()):
                    names.append(contributor)
        return names
 