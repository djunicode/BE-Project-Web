from .models import Teacher, Inhouse_Project,Outhouse_Project
from rest_framework import serializers

class TeacherSerializer(serializers.HyperlinkedModelSerializer):
    inhouse_projects = serializers.HyperlinkedRelatedField(many = True, view_name = 'BEProjectsApp:inhouse_project-detail', read_only = True)
    outhouse_projects = serializers.HyperlinkedRelatedField(many = True, view_name = 'BEProjectsApp:outhouse_project-detail', read_only = True)

    class Meta:
        model = Teacher
        fields = ('teacher_id', 'teacher_name', 'username', 'subject','inhouse_projects','outhouse_projects')


class InhouseProjectSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source = 'teacher_id.teacher_name')
    domain_name = serializers.CharField(source = 'get_domain_display')

    class Meta:
        model = Inhouse_Project
        fields = ('title','teacher_id','teacher_name','description','year_created','document','approved','contributers','domain','domain_name')

class OuthouseProjectSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source = 'teacher_id.teacher_name')
    domain_name = serializers.CharField(source = 'get_domain_display')

    class Meta:
        model = Outhouse_Project
        fields = ('title','teacher_id','teacher_name','description','year_created','document','approved','contributers','domain','domain_name','company','supervisor')

