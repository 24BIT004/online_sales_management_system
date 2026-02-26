from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import GuestOrder

# =========================
# USER REGISTRATION
# =========================
class UserRegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        if password != confirm_password:
            raise serializers.ValidationError({
                "password": "Passwords do not match"
            })

        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({
                "username": "Username already exists"
            })

        if email and User.objects.filter(email=email).exists():
            raise serializers.ValidationError({
                "email": "Email already registered"
            })

        return data

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email"),
            password=validated_data["password"]
        )

# =========================
# USER LOGIN
# =========================
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data['username'],
            password=data['password']
        )
        if not user:
            raise serializers.ValidationError("Invalid username or password")
        return user


# 
# GUEST ORDER SERIALIZER
# =========================
class GuestOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuestOrder
        fields = '__all__'
        read_only_fields = ['control_number', 'amount', 'is_paid', 'created_at']
