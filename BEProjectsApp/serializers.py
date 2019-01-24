from .models import Teacher, Inhouse_Project,Outhouse_Project
from rest_framework import serializers

class InhouseProjectSerializer(serializers.HyperlinkedModelSerializer):
    teacher_id = serializers.ReadOnlyField(source = 'teacher_id.username')
    
    class Meta:
        model = Inhouse_Project
        fields = ('title','teacher_id','description','year_created','year_published','document','approved','contributers','domain')

class OuthouseProjectSerializer(serializers.HyperlinkedModelSerializer):
    teacher_id = serializers.ReadOnlyField(source = 'teacher_id.username')
    
    class Meta:
        model = Outhouse_Project
        fields = ('title','teacher_id','description','year_created','document','approved','contributers','domain','company','supervisor')

class TeacherSerializer(serializers.HyperlinkedModelSerializer):
    inhouse_projects = serializers.HyperlinkedRelatedField(many = True, view_name = 'BEProjectsApp:inhouse_project-detail', read_only = True)

    class Meta:
        model = Teacher
        fields = ('teacher_id', 'teacher_name', 'username', 'subject','inhouse_projects')