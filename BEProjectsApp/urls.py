from rest_framework.routers import DefaultRouter, SimpleRouter
from django.conf.urls import url
from django.urls import include,path
from rest_framework_swagger.views import get_swagger_view
from BEProjectsApp import views


app_name = "BEProjectsApp"
router = DefaultRouter()
router.register(r"projects", views.ProjectViewSet)
router.register(r"teachers", views.TeacherViewSet)
router.register(r"contributors", views.ContributorViewSet)
# router.register(r"contributors-url",views.ContributorUrlViewSet)

#SchemaView
schema_view = get_swagger_view(title="BEProjects")


urlpatterns = [
    url(r"^api/", include(router.urls)),
    url(r"^api/search/", views.SearchProjectView.as_view(), name="search"),
    url(r"^schema/$",schema_view),
]
