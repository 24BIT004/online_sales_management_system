from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

# Simple homepage view (optional but helps avoid 404)
def home(request):
    return HttpResponse("Online Sales Management System is Running")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('App1.urls')),  # Connect App1 routes
    path('', home),  # Homepage fallback
]