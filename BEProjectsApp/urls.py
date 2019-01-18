from rest_framework.routers import DefaultRouter
from django.conf.urls import url
from django.urls import include
from . import views

app_name = 'BEProjectsApp'

router = DefaultRouter()
router.register(r'inhouse_projects', views.InhouseProjectViewSet)

urlpatterns = [
    url(r'^api/',include(router.urls)),
]