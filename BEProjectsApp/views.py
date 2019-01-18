from .models import Inhouse_Project
from .serializers import InhouseProjectSerializer
from rest_framework import viewsets

class InhouseProjectViewSet(viewsets.ModelViewSet):
    queryset = Inhouse_Project.objects.all()
    serializer_class = InhouseProjectSerializer
    