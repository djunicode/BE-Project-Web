from BEProjectsApp.models import Teacher, Inhouse_Project,Outhouse_Project,Contributers
from rest_framework import serializers

class ContributerObjectRelatedField(serializers.RelatedField):
    """
    A custom field to use for the `tagged_object` generic relationship.
    """
    queryset = Contributers.objects.all()
    def to_representation(self, value):
        """
        Serialize InhouseProject instances using a InhouseProject serializer,
        and OuthouseProject instances using a OuthouseProject serializer.
        """
        if isinstance(value, Inhouse_Project):
            serializer = InhouseProjectSerializer(value)
        elif isinstance(value, Outhouse_Project):
            serializer = OuthouseProjectSerializer(value)
        else:
            raise Exception('Unexpected type of tagged object')
        return serializer.data
      

class InhouseProjectSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source = 'teacher_id.teacher_name')
    domain_name = serializers.CharField(source = 'get_domain_display')
    contributers = ContributerObjectRelatedField()
    class Meta:
        model = Inhouse_Project
        fields = ('title','teacher_id','teacher_name','description','year_created','document','approved','contributers','domain','domain_name')


class OuthouseProjectSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source = 'teacher_id.teacher_name')
    domain_name = serializers.CharField(source = 'get_domain_display')
    contributers = ContributerObjectRelatedField()
    class Meta:
        model = Outhouse_Project
        fields = ('title','teacher_id','teacher_name','description','year_created','document','approved','contributers','domain','domain_name','company','supervisor')


class TeacherSerializer(serializers.HyperlinkedModelSerializer):
    inhouse_projects = serializers.HyperlinkedRelatedField(
        many=True, view_name="BEProjectsApp:inhouse_project-detail", read_only=True
    )
    outhouse_projects = serializers.HyperlinkedRelatedField(
        many=True, view_name="BEProjectsApp:outhouse_project-detail", read_only=True
    )
    class Meta:
        model = Teacher
        fields = ( 
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "subject",
            "username",
            "password",
        )
        extra_kwargs = {"password": {"write_only": True}}

    
    def create(self, validated_data):
        users_data = validated_data.pop('user')
        teacher = Teacher.objects.create(**validated_data)
        for user_data in users_data:
            User.objects.create(teacher=teacher, **user_data)
        return teacher


