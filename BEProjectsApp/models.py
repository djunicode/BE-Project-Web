from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from datetime import date

DOMAIN_CHOICES = [
    ("Data Mining and Analytics", ("Data Mining and Analytics")),
    ("Machine Learning", ("Machine Learning")),
    ("Deep Learning", ("Deep Learning")),
    ("Image Processing / Computer Vision", ("Image Processing / Computer Vision")),
    (
        "Natural Language Processing / Artificial Intelligence",
        ("Natural Language Processing / Artificial Intelligence"),
    ),
    ("Networking / Security", ("Networking / Security")),
    ("Internet of Things(IOT)", ("Internet of Things(IOT)")),
    ("Mobile Computing", ("Mobile Computing")),
    ("Big Data", ("Big Data")),
    ("Cloud Computing", ("Cloud Computing")),
    (
        "Computer Vision and Artificial Intelligence",
        ("Computer Vision and Artificial Intelligence"),
    ),
    ("Blockchain", ("Blockchain")),
    ("Operating Systems", ("Operating Systems")),
    ("GAN's", ("GAN's")),
    ("Audio Processing", ("Audio Processing")),
    ("Video Processing", ("Video Processing")),
    ("Cryptography", ("Cryptography")),
]

YEAR_CHOICES = [("FE", ("FE")), ("SE", ("SE")), ("TE", ("TE")), ("BE", ("BE"))]

DIVISION_CHOICES = [("A", ("A")), ("B", ("B"))]


class User(AbstractUser):
    is_contributor = models.BooleanField(default=False)
    is_teacher = models.BooleanField(default=False)


class Teacher(models.Model):
    user = models.OneToOneField(
        User, related_name="teacher_user", on_delete=models.CASCADE, primary_key=True
    )

    # additional attributes
    subject = models.CharField(max_length=150)

    @property
    def user__username(self):
        return self.user.username

    @property
    def user__email(self):
        return self.user.email

    @property
    def user__first_name(self):
        return self.user.first_name

    @property
    def user__last_name(self):
        return self.user.last_name

    def __str__(self):
        return self.user.get_full_name()


class Contributor(models.Model):
    user = models.OneToOneField(
        User,
        related_name="contributor_user",
        on_delete=models.CASCADE,
        primary_key=True,
    )

    year = models.CharField(
        choices=YEAR_CHOICES, default="None", null=False, blank=False, max_length=3
    )
    division = models.CharField(
        choices=DIVISION_CHOICES, default="None", null=False, blank=False, max_length=2
    )
    github_id = models.URLField(blank=True)

    @property
    def user__username(self):
        return self.user.username

    @property
    def user__email(self):
        return self.user.email

    @property
    def user__first_name(self):
        return self.user.first_name

    @property
    def user__last_name(self):
        return self.user.last_name

    def __str__(self):
        return self.user.get_full_name()


class Project(models.Model):
    # Project title
    title = models.CharField(max_length=100, null=False, blank=False)

    # ID of the teacher mentoring the project
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True)

    # Project description
    description = models.TextField(null=False, blank=False)

    # Project abstract
    abstract = models.TextField(null=False, blank=False)

    # Year created
    year_created = models.PositiveSmallIntegerField(
        null=False, blank=False, default=int(str(date.today())[:4])
    )

    # Contributor year
    contributor_year = models.CharField(
        choices=YEAR_CHOICES, default="None", null=False, blank=False, max_length=3
    )

    # Is this a BE project?
    is_BE_project = models.BooleanField(null=False, blank=False, default=False)

    # Project ID (only for BE projects) - Format: <Year_GroupID> eg. 2020_69
    BE_project_id = models.CharField(max_length=10, default="None")

    # Domain list
    domain = models.CharField(
        choices=DOMAIN_CHOICES, default="None", null=False, blank=False, max_length=100
    )

    # PDF to be uploaded
    report = models.FileField(null=True, blank=True)

    # Executable to be uploaded
    executable = models.FileField(null=True, blank=True)

    # GitHub repo link
    github_repo = models.CharField(max_length=200,null=True,blank=True,default="")

    # URL of the video demo
    demo_video = models.CharField(max_length=200,null=True,blank=True,default="")

    # To check whether project is approved or not
    approved = models.BooleanField(default=False)

    # Boolean field to check whether the project is inhouse or outhouse
    is_inhouse = models.BooleanField(null=False, blank=False, default=True)

    awards = models.TextField(null=True, blank=True, default="None")

    # Property of an outhouse project
    company = models.CharField(max_length=100, null=True, blank=True, default="None")

    supervisor = models.CharField(max_length=100, null=True, blank=True, default="None")

    journal = models.CharField(max_length=100, null=True, blank=True, default="None")

    contributors = models.ManyToManyField(Contributor)

    def publish(self):
        self.approved = True
        self.save()

    def __str__(self):
        return self.title
