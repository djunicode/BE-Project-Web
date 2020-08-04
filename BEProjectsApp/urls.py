from rest_framework.routers import DefaultRouter, SimpleRouter
from django.conf.urls import url
from django.urls import include, path
from rest_framework_swagger.views import get_swagger_view
from . import views


# app_name = "BEProjectsApp"
router = DefaultRouter()
router.register(r"projects", views.ProjectViewSet)
router.register(r"teachers", views.TeacherViewSet)
router.register(r"contributors", views.ContributorViewSet)
# router.register(r"contributors-url",views.ContributorUrlViewSet)

# SchemaView
schema_view = get_swagger_view(title="BEProjects")


urlpatterns = [
    url(r"^api/", include((router.urls, "api"))),
    url(r"^api/search/", views.SearchProjectView.as_view(), name="search"),
    url(r"^schema/$", schema_view),
    path("get_domains", views.get_domains, name="get_domains"),
    path("account_login", views.account_login, name="account_login"),
    path("project", views.ProjectsView.as_view(), name="project"),
    path("my_projects", views.my_projects, name="my_projects"),
    path("browse_projects", views.BrowseProjects.as_view(), name="browse_projects"),
    path("create_project", views.create_project, name="create_project"),
    path("approve_project", views.approve_project, name="approve_project"),
    path("update_project/<int:pk>", views.update_project, name="update_project"),
    path(
        "update_project_report/<int:pk>",
        views.update_project_report,
        name="update_project_report",
    ),
    path("delete_project", views.delete_project, name="delete_project"),
    path("update_user", views.update_user, name="update_user"),
]

urlpatterns += router.get_urls()
