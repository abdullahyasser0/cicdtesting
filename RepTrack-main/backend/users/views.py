from django.shortcuts import render, redirect
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from .forms import SimpleForm,SignupForm
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .models import User 
from databaseApi.views import get_Users,get_user1,get_Coaches
from databaseApi.views import logout_required


# Create your views here.


def home(request):
    return render(request, "test.html")

def dashboard(request):
    user_id = request.session.get('user_id')
    user = get_user1(user_id)[0]
    return render(request, "../templates/Dashboard/Dashboard.html", {'user':user})

def userstats(request):
    user_id = request.session.get('user_id')
    user = get_user1(user_id)[0]
    return render(request, "../templates/Dashboard/UserStatistics.html", {'user':user})
@login_required 
def logout_view(request):
    request.session.flush()
    return redirect('login')

def Equip(request):
    user_id = request.session.get('user_id')
    user = get_user1(user_id)[0]
    return render(request, "../templates/Admin/AddEquipment.html",{'users':users,'id':user_id,'user':user})


@login_required 
def users(request):
    users = get_Users()
    user_id = request.session.get('user_id')
    user = get_user1(user_id)[0]
    return render(request, '../templates/profile/ActiveMembers.html', {'users': users, 'id':user_id, 'user':user})
@login_required 
def coaches(request):
    users = get_Coaches()    
    user_id = request.session.get('user_id')
    user = get_user1(user_id)[0]
    return render(request, '../templates/profile/ActiveCoaches.html', {'users': users , 'id':user_id, 'user':user})
@login_required 
def admins(request):
    
    user_id = request.session.get('user_id')
    users = get_user1(user_id)
    return render(request, '../templates/profile/information.html', {'users': users,'id':user_id})

@login_required
def protected_page(request):
    return render(request, "protected_page.html")

@logout_required
def login(request):
    return render(request,"login/Login.html")

def form_view(request):
    if request.method == 'POST':
        form = SimpleForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            return HttpResponse(f"Thank you, {name}! Your email is {email}.")
    else:
        form = SimpleForm()
    
    return render(request, 'myform/form.html', {'form': form})
@logout_required
def signup(request):
    return render(request, "signup/signup.html")
@logout_required
def signup_view(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)  # Handle form submission
        if form.is_valid():
            # Retrieve form data
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            phone = form.cleaned_data['phone']
            password = form.cleaned_data['password']

            # For now, let's just return a success message
            return HttpResponse(f"Signup successful! Username: {username}, Email: {email}, Phone: {phone}")
    else:
        form = SignupForm()  # Create a new form instance for GET request

    return render(request, 'signup/signup.html', {'form': form})

