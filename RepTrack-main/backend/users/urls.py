from django.urls import path,include
from . import views
from databaseApi.views import signup,get_Users,get_Profiles,change_data,change_Password,get_Coaches,verify_token,profile_view,signup, login,forget_password_view ,verify_otp_view,reset_password_view
from users.views import signup_view,users,admins,coaches,dashboard,Equip

urlpatterns = [path('login/', views.login, name='login'),
                path('logout/', views.logout_view, name='logout'),
                path("protectedpage/",views.protected_page),
                path("test/",views.home),
                path('form/', views.form_view),
                path('signup/',views.signup),
                path('signupform/',signup, name = 'signupform'),
                path('loginform/',login, name = 'loginform'),
                path('users/',get_Users),
                path('admin/',get_Profiles),
                path('coaches/',get_Coaches),
                path('profilesData/',admins,name='profiles'),
                path('changeDataForm/',change_data, name = 'changeDataForm'),
                path('changePasswordForm/',change_Password, name = 'changePasswordForm'),
                path('forget-password/', forget_password_view, name='forget_password'),
                path('verify-otp/', verify_otp_view, name='verify_otp'),
                path('reset-password/', reset_password_view, name='reset_password'),
                path('verify-token/', verify_token, name='verify_token'),
                path('Dashoard/',dashboard, name = 'Dashboard'),
                path('Dashboard/',dashboard, name = 'Dashboard'),
                path('Equip/',Equip, name = 'Equip'),
                ]
