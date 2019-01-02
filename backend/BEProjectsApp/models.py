from django.db import models

class Teacher(models.Model):
	teacher_id=models.AutoField(primary_key=True)
	teacher_name=models.CharField(max_length=25)
	username=models.CharField(max_length=25)
	password=models.CharField(max_length=256)
	subject=models.CharField(max_length=25)
# Create your models here.
