from django_filters.rest_framework import DjangoFilterBackend
import django_filters
from .models import *


class BrowseProjectFilter(DjangoFilterBackend):
    def filter_queryset(self, request, queryset, view):
        filter_class = self.get_filter_class(view, queryset)

        if filter_class:
            return filter_class(
                request.query_params, queryset=queryset, request=request
            ).qs
        return queryset


class ProjectFilter(django_filters.FilterSet):
    class Meta:
        model = Project
        fields = (
            "domain",
            "approved",
            "year_created",
            "teacher__user__username",
            "is_inhouse",
        )
