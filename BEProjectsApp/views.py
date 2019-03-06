from BEProjectsApp.models import Project, TeacherProfile, Contributer
from BEProjectsApp.serializers import (
    ProjectSerializer,
    TeacherSerializer,
    ContributerSerializer,
    UserSerializer,
)
from rest_framework import viewsets
from rest_framework import filters
from rest_framework import serializers
from django.contrib.auth.models import User

# from drf_multiple_model.viewsets import FlatMultipleModelAPIViewSet


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = TeacherProfile.objects.all()
    serializer_class = TeacherSerializer


class ContributerViewSet(viewsets.ModelViewSet):
    queryset = Contributer.objects.all()
    serializer_class = ContributerSerializer


# class UserViewSet(viewsets.ModelViewSet):
#    queryset = User.objects.all()
#    serializer_class = UserSerializer


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
#     search_fields = ('^title',)

# class SearchProjectView(FlatMultipleModelAPIViewSet):
#     def get_querylist(self):
#         c = 0

#         title = self.request.query_params['title']
#         querylist = [
#             {
#                 'queryset' : Inhouse_Project.objects.filter(title__startswith = title),
#                 'serializer_class' : InhouseProjectSerializer,
#                 'label' : 'InhouseProject',
#             },
#             {
#                 'queryset' : Outhouse_Project.objects.filter(title__startswith = title),
#                 'serializer_class' : OuthouseProjectSerializer,
#                 'label' : 'OuthouseProject',
#             },

#         ]

#         for _ in querylist:

#             c = c +1
#         c = c-1
#         print(c)


#         return querylist
