from django.urls import path
from .views import UserRegisterView, UserLoginView, GuestOrderView

urlpatterns = [
    # User authentication
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),

    # Guest order
    path('guest-order/', GuestOrderView.as_view(), name='guest-order'),
    path('guest-order/<int:pk>/', GuestOrderView.as_view(), name='guest-order-detail'),
]
