from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericRelation

DOMAIN_CHOICES = [
    ("1", ("Data Mining & Analytics")),
    ("2", ("Machine Learning")),
    ("3", ("Deep Learning")),
    ("4", ("Image Processing/Computer Vision")),
    ("5", ("Natural Language Processing/Artificial Intelligence")),
    ("6", ("Networking/Security")),
    ("7", ("Internet of Things(IOT)")),
    ("8", ("Mobile Computing")),
    ("9", ("Big Data")),
    ("10", ("Cloud Computing")),
    ("11", ("Computer Vision & Artificial Intelligence")),
    ("12", ("Blockchain")),
]

class Contributers(models.Model):
    name = models.CharField(max_length=100, blank=False)
    email = models.CharField(max_length=100,blank=False)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type','object_id')

    def __str__(self):
        return self.name


class Teacher(AbstractUser):
    
    #additional attributes
    subject = models.CharField(max_length=150)



# In house Project model
class Inhouse_Project(models.Model):

    # Project title
    title = models.CharField(max_length=100)
    # Id of the teacher mentoring the project
    teacher = models.ForeignKey(
        Teacher, related_name="inhouse_projects", on_delete=models.CASCADE
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

    contributers = GenericRelation(Contributers)

    def publish(self):
        self.approved = True
        self.save()

    def __str__(self):
        return self.title




class Outhouse_Project(models.Model):

    # Store the Project Title
    title = models.CharField(max_length=100, blank=False, default="Untitled Project")
    # Store the ID of the Teacher model who is mentoring the project
    teacher = models.ForeignKey(
        Teacher, related_name="outhouse_projects", on_delete=models.CASCADE
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
    contributers = GenericRelation(Contributers) 

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
        return self.title



