from rest_framework.routers import DefaultRouter, SimpleRouter
from django.conf.urls import url
from django.urls import include, path
from BEProjectsApp import views

app_name = "BEProjectsApp"
# router=SimpleRouter()
router = DefaultRouter()
router.register(r"projects", views.ProjectViewSet)
router.register(r"teachers", views.TeacherViewSet)
router.register(r"contributors", views.ContributorViewSet)
# router.register(r"users", views.UserViewSet)
# router.register(r'allprojects',views.AllProjectsView, base_name='all_projects')
# router.register(r'searchprojects',views.SearchProjectView, base_name='search_projects')

urlpatterns = [
    url(r"^api/", include(router.urls)),
    path("api/search/", views.SearchProjectView.as_view(), name="search"),
]
