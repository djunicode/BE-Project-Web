from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

DOMAIN_CHOICES = [
    ("Data Mining & Analytics", ("Data Mining & Analytics")),
    ("Machine Learning", ("Machine Learning")),
    ("Deep Learning", ("Deep Learning")),
    ("Image Processing/Computer Vision", ("Image Processing/Computer Vision")),
    (
        "Natural Language Processing/Artificial Intelligence",
        ("Natural Language Processing/Artificial Intelligence"),
    ),
    ("Networking/Security", ("Networking/Security")),
    ("Internet of Things(IOT)", ("Internet of Things(IOT)")),
    ("Mobile Computing", ("Mobile Computing")),
    ("Big Data", ("Big Data")),
    ("Cloud Computing", ("Cloud Computing")),
    (
        "Computer Vision & Artificial Intelligence",
        ("Computer Vision & Artificial Intelligence"),
    ),
    ("Blockchain", ("Blockchain")),
    ("Operating Systems", ("Operating Systems")),
]


class TeacherProfile(models.Model):
    user = models.OneToOneField(
        User, related_name="teacher_user", on_delete=models.CASCADE, primary_key=True
    )

    # additional attributes
    subject = models.CharField(max_length=150)

    def __str__(self):
        return self.user.username


# In house Project model
class Project(models.Model):
    # Project title
    title = models.CharField(max_length=100)
    # Id of the teacher mentoring the project
    teacher = models.ForeignKey(
        TeacherProfile, related_name="project", on_delete=models.CASCADE
    )
    # project description
    description = models.TextField()
    # year published and created will be stored
    year_created = models.DateTimeField(default=timezone.now)
    # PDF to be uploaded
    document = models.FileField()
    # To check whether project is approved or not
    approved = models.BooleanField(default=False)

    # domain list
    domain = models.CharField(
        choices=DOMAIN_CHOICES, default="none", blank=False, max_length=100
    )
    # boolean field to check whether the project is inhouse or outhouse
    is_inhouse = models.BooleanField(default=True)

    # property of an outhouse project
    company = models.CharField(max_length=100, blank=True, default="none")
    supervisor = models.CharField(max_length=100, blank=True, default="none")

    def publish(self):
        self.approved = True
        self.save()

    def __str__(self):
        return self.title


class Contributor(models.Model):
    name = models.CharField(max_length=100, blank=False)
    last_name = models.CharField(max_length=100, blank=False)
    email = models.CharField(max_length=100, blank=False)
    project = models.ForeignKey(
        Project, related_name="contributor", on_delete=models.CASCADE
    )

    def __str__(self):
        return self.name + " " + self.last_name
