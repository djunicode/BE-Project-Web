from BEProjectsApp.models import TeacherProfile, Project, Contributor
from rest_framework import serializers
from django.contrib.auth.models import User


class ContributorSerializer(serializers.ModelSerializer):
    # project = serializers.HyperlinkedRelatedField(
    #     many=False, view_name="BEProjectsApp:project-detail", read_only=True
    # )
    class Meta:
        model = Contributor
        fields = ("id", "name", "last_name", "email", "project")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("first_name", "last_name", "username", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}


class ProjectSerializer(serializers.ModelSerializer):
    # teacher = serializers.HyperlinkedIdentityField(
    #     many=False, view_name="BEProjectsApp:teacherprofile-detail", read_only=True
    # )
    contributor = serializers.HyperlinkedRelatedField(
        many=True, view_name="BEProjectsApp:contributor-detail", read_only=True
    )
    # contributers = ContributerSerializer(many=True, read_only=True)
    class Meta:
        model = Project
        fields = (
            "title",
            "teacher",
            "description",
            "approved",
            "document",
            "contributor",
            "domain",
            "is_inhouse",
            "company",
            "supervisor",
        )


class TeacherSerializer(serializers.HyperlinkedModelSerializer):
    project = serializers.HyperlinkedRelatedField(
        many=True, view_name="BEProjectsApp:project-detail", read_only=True
    )
    user = UserSerializer(read_only=False)

    class Meta:
        model = TeacherProfile
        fields = ("subject", "project", "user")

    def create(self, validated_data):
        user = User(
            first_name=validated_data["user"]["first_name"],
            last_name=validated_data["user"]["last_name"],
            email=validated_data["user"]["email"],
            username=validated_data["user"]["username"],
        )
        user.set_password(validated_data["user"]["password"])
        user.save()
        teacher = TeacherProfile(user=user, subject=validated_data["subject"])
        teacher.save()
        return teacher


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=10)
    password = serializers.CharField(style={"input_type": "password"})
