"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from users.views import signup_view
from databaseApi.views import profile_view,change_data,change_Password,verify_token
from users.views import signup_view,users,admins,coaches
from databaseApi.views import profile_view,change_data,change_Password,forget_password_view,verify_otp_view,reset_password_view
from users.views import signup_view,users,admins,coaches,dashboard, userstats
from users.views import signup_view,users,admins,coaches,dashboard, userstats,Equip


urlpatterns = [
    path("admin/", admin.site.urls),
    # path("",include('api.urls')),
    path('', signup_view, name='signup'),
    path("accouns/", include("allauth.urls")),
    path("main/", include("users.urls")),
    path("protected/",include("users.urls")),
    path('signup/', include('users.urls')),
    path('profile/', profile_view, name='profile/'),
    path('profilesData/',admins,name='profiles'),
    path('coachesData/',coaches,name='coachesData'),
    path('usersData/',users,name='usersData'),
    path('profilesData/',admins,name='profiles'),
    path('changeDataForm/',change_data, name = 'changeDataForm'),
    path('changePasswordForm/',change_Password, name = 'changePasswordForm'),
    path('verify-token/', verify_token, name='verify_token'),
     path('forget-password/', forget_password_view, name='forget_password'),
    path('verify-otp/', verify_otp_view, name='verify_otp'),
    path('reset-password/', reset_password_view, name='reset_password'),

    path('Dashboard/',dashboard, name = 'changePasswordForm'),
    path('Dashboard/',dashboard, name = 'Dashboard'),
    path('userstats/',userstats, name = 'userstats'),
    path('Equip/',Equip, name = 'Equip')

]
