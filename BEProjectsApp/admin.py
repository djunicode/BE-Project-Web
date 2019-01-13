from django.contrib import admin
from .models import Teacher, Inhouse_Project, Outhouse_Project

# Register your models here.
admin.site.register(Teacher)
admin.site.register(Inhouse_Project)
admin.site.register(Outhouse_Project)
