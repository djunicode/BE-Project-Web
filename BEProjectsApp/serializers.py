from BEProjectsApp.models import TeacherProfile, Project, Contributer
from rest_framework import serializers
from django.contrib.auth.models import User


class ContributerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contributer
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("first_name", "last_name", "username", "email")


class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    teacher = serializers.HyperlinkedRelatedField(
        many=False, view_name="BEProjectsApp:teacherprofile-detail", read_only=True
    )
    contributers = ContributerSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = (
            "title",
            "teacher",
            "description",
            "year_created",
            "document",
            "contributers",
            "domain",
        )


class TeacherSerializer(serializers.HyperlinkedModelSerializer):
    projects = serializers.HyperlinkedRelatedField(
        many=True, view_name="BEProjectsApp:project-detail", read_only=True
    )
    user = UserSerializer(read_only=True)

    class Meta:
        model = TeacherProfile
        fields = ("subject", "projects", "user")
