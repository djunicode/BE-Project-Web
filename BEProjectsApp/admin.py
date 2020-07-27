from django.contrib import admin
from .models import Teacher, Project, Contributor, User
from django.contrib.auth.admin import UserAdmin
from datetime import date

from datetime import date


class UserAdmin(UserAdmin):

    fieldsets = UserAdmin.fieldsets + (
        (None, {"fields": ("is_contributor", "is_teacher")},),
    )


# Register your models here.


admin.site.register(Teacher)
admin.site.register(Project)
admin.site.register(Contributor)
admin.site.register(User, UserAdmin)
