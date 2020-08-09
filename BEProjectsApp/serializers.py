from django.contrib.auth import password_validation
from .models import Teacher, Project, Contributor, User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "is_contributor",
            "is_teacher",
        ]


class ContributorSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Contributor
        fields = "__all__"


class TeacherSerializer1(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Teacher
        fields = "__all__"


class AllProjectSerializer(serializers.ModelSerializer):
    # teacher = serializers.HyperlinkedIdentityField(
    #     many=False, view_name="BEProjectsApp:teacher-detail", read_only=True
    # )
    # contributor = serializers.HyperlinkedRelatedField(
    #     many=True, view_name="api:contributor-detail", read_only=True
    # )

    contributors = ContributorSerializer(many=True, read_only=True)
    teacher = TeacherSerializer1(many=False, read_only=True)

    class Meta:
        model = Project
        fields = "__all__"

class ProjectSerializer(serializers.ModelSerializer):
    contributors = ContributorSerializer(many=True, read_only=True)
    teacher = TeacherSerializer1(many=False, read_only=True)

    class Meta:
        model = Project
        exclude = [
            "report",
            "executable",
            "github_repo",
            "demo_video",
            "company",
            "supervisor",
        ]


class TeacherSerializer(serializers.ModelSerializer):
    # project = serializers.HyperlinkedRelatedField(
    #     many=True, view_name="api:project-detail", read_only=True
    # )
    project = ProjectSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=False)

    url = serializers.HyperlinkedIdentityField(view_name="api:teacher-detail")

    class Meta:
        model = Teacher
        fields = ("pk", "url", "subject", "project", "user")

    # def create(self, validated_data):
    #     user = User(
    #         first_name=validated_data["user"]["first_name"],
    #         last_name=validated_data["user"]["last_name"],
    #         email=validated_data["user"]["email"],
    #         username=validated_data["user"]["username"],
    #     )
    #     user.set_password(validated_data["user"]["password"])
    #     user.save()
    #     teacher = Teacher(user=user, subject=validated_data["subject"])
    #     teacher.save()
    #     return teacher


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=10)
    password = serializers.CharField(style={"input_type": "password"})


class UpdateProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"


class UpdateProjectReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["report"]


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        password_validation.validate_password(value)
        return value
