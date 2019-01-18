from .models import Inhouse_Project
from rest_framework import serializers

class InhouseProjectSerializer(serializers.HyperlinkedModelSerializer):
    teacher_id = serializers.ReadOnlyField(source = 'teacher_id.username')
    
    class Meta:
        model = Inhouse_Project
        fields = ('title','teacher_id','description','year_created','year_published','document','approved','contributers','domain')