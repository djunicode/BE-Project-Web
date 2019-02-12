from rest_framework.routers import DefaultRouter,SimpleRouter
from django.conf.urls import url
from django.urls import include,path
from BEProjectsApp import views

app_name = 'BEProjectsApp'
#router=SimpleRouter()
router = DefaultRouter()
router.register(r'inhouse_projects', views.InhouseProjectViewSet)
router.register(r'outhouse_projects', views.OuthouseProjectViewSet)
router.register(r'teachers',views.TeacherViewSet)
#router.register(r'allprojects',views.AllProjectsView, base_name='all_projects')
# router.register(r'searchprojects',views.SearchProjectView, base_name='search_projects')

urlpatterns = [
  url(r'^api/',include(router.urls)),
]