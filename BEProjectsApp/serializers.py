from .models import Teacher, Inhouse_Project,Outhouse_Project
from rest_framework import serializers

class TeacherSerializer(serializers.HyperlinkedModelSerializer):
    inhouse_projects = serializers.HyperlinkedRelatedField(many = True, view_name = 'BEProjectsApp:inhouse_project-detail', read_only = True)

    class Meta:
        model = Teacher
        fields = ('teacher_id', 'teacher_name', 'username', 'subject','inhouse_projects')


class InhouseProjectSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Inhouse_Project
        fields = ('id','title','teacher_id','description','year_created','document','approved','contributers','domain')

class OuthouseProjectSerializer(serializers.ModelSerializer):

    
    class Meta:
        model = Outhouse_Project
        fields = ('id','title','teacher_id','description','year_created','document','approved','contributers','domain','company','supervisor')
