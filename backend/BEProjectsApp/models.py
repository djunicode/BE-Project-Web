from django.db import models
from django.utils import timezone

DOMAIN_OHP = ['none',
    'Data Mining & Analytics',
    'Machine Learning',
    'Image Processing/Computer Vision',
    'Natural Language Processing/Artificial Intelligence',
    'Networking/Security',
    'Internet of Things(IOT)',
    'Mobile Computing',
    'Big Data',
    'Cloud Computing',
    'Computer Vision & Artificial Intelligence'
    ]

DOMAIN_CHOICES_OHP = sorted((item,item) for item in DOMAIN_OHP)

# Create your models here.


#Teacher model
class Teacher(models.Model):
    #teacher class attributes here
    name='teacher'

#OUT HOUSE PROJECT MODEL
class OH_Project(models.Model):

    #Store the Project Title
    name = models.CharField(max_length = 100, blank = False, default = 'Untitled Project')
    #Store the ID of the Teacher model who is mentoring the project
    teacher_id = models.ForeignKey(Teacher, related_name = 'teachers', on_delete = models.CASCADE)
    #project description
    description = models.TextField()
    #year published and created will be stored
    year_created = models.DateTimeField(default = timezone.now)
    year_published = models.DateTimeField(blank = True, null = True)
    #to store the files uploaded
    document = models.FileField()
    #domain list
    domain = models.CharField(choices = DOMAIN_CHOICES_OHP, default = 'none', blank = False, max_length = 100)
    #out house details
    company = models.CharField(max_length = 100, blank = False, default = 'none')
    supervisor = models.CharField(max_length = 100, blank = False, default = 'none')
    #contributers stored as a text field
    contributers = models.TextField()
    '''
    The purpose of the pubish function is to create the functionality of drafts where
    the teachers get to approve a project and then it will be published till then
    only created date is stored.
    The display of search results will only be done with the published date so if that
    is empty it should not be shown in the search results.
    '''
    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def __str__(self):
        return self.name
