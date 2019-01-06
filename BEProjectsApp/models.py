from django.db import models
from django.utils import timezone


DOMAIN_CHOICES = [
    (1, ("none")),
    (2, ("Data Mining & Analytics")),
    (3, ("Machine Learning")),
    (4, ("Deep Learning")),
    (5, ("Image Processing/Computer Vision")),
    (6, ("Natural Language Processing/Artificial Intelligence")),
    (7, ("Networking/Security")),
    (8, ("Internet of Things(IOT)")),
    (9, ("Mobile Computing")),
    (10, ("Big Data")),
    (11, ("Cloud Computing")),
    (12, ("Computer Vision & Artificial Intelligence")),
    (13, ("Blockchain")),
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
class IN_Project(models.Model):

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
