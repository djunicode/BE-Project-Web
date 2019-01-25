from .models import Inhouse_Project, Teacher, Outhouse_Project
from .serializers import InhouseProjectSerializer, TeacherSerializer, OuthouseProjectSerializer
from rest_framework import viewsets
from rest_framework import filters
from rest_framework import serializers
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
    
class AllProjectsView(FlatMultipleModelAPIViewSet):
    sorting_fields = ['type','title']
    querylist = [
        {
            'queryset' : Inhouse_Project.objects.all(),
            'serializer_class' : InhouseProjectSerializer,
            'label' : 'InhouseProject',
        },
        {
            'queryset' : Outhouse_Project.objects.all(),
            'serializer_class' : OuthouseProjectSerializer,
            'label' : 'OuthouseProject',
        },
        
    ]
    filter_backends = (filters.SearchFilter,)
    search_fields = ('^title',)
    
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
