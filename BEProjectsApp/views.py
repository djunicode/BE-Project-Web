from .models import Inhouse_Project, Teacher, Outhouse_Project
from .serializers import InhouseProjectSerializer, TeacherSerializer, OuthouseProjectSerializer
from rest_framework import viewsets
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
    sorting_fields = ['title']
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