from django.contrib import admin
from .models import TeacherProfile, Project, Contributor

# Register your models here.
admin.site.register(TeacherProfile)
admin.site.register(Project)
admin.site.register(Contributor)
