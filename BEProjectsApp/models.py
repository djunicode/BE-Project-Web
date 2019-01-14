from django.db import models
from django.utils import timezone

DOMAIN_CHOICES = [
    (1, ("Data Mining & Analytics")),
    (2, ("Machine Learning")),
    (3, ("Deep Learning")),
    (4, ("Image Processing/Computer Vision")),
    (5, ("Natural Language Processing/Artificial Intelligence")),
    (6, ("Networking/Security")),
    (7, ("Internet of Things(IOT)")),
    (8, ("Mobile Computing")),
    (9, ("Big Data")),
    (10, ("Cloud Computing")),
    (11, ("Computer Vision & Artificial Intelligence")),
    (12, ("Blockchain")),
]


class Teacher(models.Model):

    teacher_id = models.AutoField(primary_key=True)

    teacher_name = models.CharField(max_length=150)

    username = models.CharField(max_length=150)

    password = models.CharField(max_length=256)

    subject = models.CharField(max_length=150)

    def __str__(self):

        return self.teacher_name


# In house Project model
class Inhouse_Project(models.Model):

    # Project title
    title = models.CharField(max_length=100)
    # Id of the teacher mentoring the project
    teacher_id = models.ForeignKey(
        Teacher, related_name="teachers", on_delete=models.CASCADE
    )
    # project description
    description = models.TextField()
    # year published and created will be stored
    year_created = models.DateTimeField(default=timezone.now)
    year_published = models.DateTimeField(blank=True, null=True)
    # PDF to be uploaded
    document = models.FileField()
    # To check whether project is approved or not
    approved = models.BooleanField(default=False)
    # contributers stored as a text field
    contributers = models.TextField()
    # domain list
    domain = models.CharField(
        choices=DOMAIN_CHOICES, default="none", blank=False, max_length=100
    )

    """

    The purpose of the pubish function is to create the functionality of drafts where

    the teachers get to approve a project and then it will be published till then

    only created date is stored.

    The display of search results will only be done with the published date so if that

    is empty it should not be shown in the search results.

    """

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def __str__(self):
        return self.title


class Outhouse_Project(models.Model):

    # Store the Project Title
    name = models.CharField(max_length=100, blank=False, default="Untitled Project")
    # Store the ID of the Teacher model who is mentoring the project
    teacher_id = models.ForeignKey(
        Teacher, related_name="teacher", on_delete=models.CASCADE
    )
    # project description
    description = models.TextField()
    # year published and created will be stored
    year_created = models.DateTimeField(default=timezone.now)
    approved = models.BooleanField(default=False)
    # to store the files uploaded
    document = models.FileField()
    # domain list
    domain = models.CharField(
        choices=DOMAIN_CHOICES, default="none", blank=False, max_length=100
    )
    # out house details
    company = models.CharField(max_length=100, blank=False, default="none")
    supervisor = models.CharField(max_length=100, blank=False, default="none")
    # contributers stored as a text field
    contributers = models.TextField()

    """

    The purpose of the pubish function is to create the functionality of drafts where

    the teachers get to approve a project and then it will be published till then

    only created date is stored.

    The display of search results will only be done with the published date so if that

    is empty it should not be shown in the search results.

    """

    def approve(self):
        self.approved = True
        self.save()

    def __str__(self):
        return self.name
