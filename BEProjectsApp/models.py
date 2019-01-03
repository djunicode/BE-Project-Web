from django.db import models


class Teacher(models.Model):
    teacher_id = models.AutoField(primary_key=True)
    teacher_name = models.CharField(max_length=150)
    username = models.CharField(max_length=150)
    password = models.CharField(max_length=256)
    subject = models.CharField(max_length=150)

    def __str__(self):
        return self.teacher_name
