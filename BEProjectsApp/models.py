from django.db import models
from django.contrib.auth.models import User

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
    user = models.OneToOneField(User, on_delete="models.CASCADE")
    domain = models.IntegerField(choices=DOMAIN_CHOICES, default="none", blank=False)

    def __str__(self):
        return self.user.first_name + " " + self.user.last_name
