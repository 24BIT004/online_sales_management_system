from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from django.db.models import Q
from django.db import OperationalError, ProgrammingError
from .models import GuestOrder
from .serializers import UserRegisterSerializer, UserLoginSerializer, GuestOrderSerializer
from django.http import HttpResponse
from django.shortcuts import render




def home(request):
    return HttpResponse("Online Sales Management System is Running")

# =========================
# USER REGISTER (unchanged)
# =========================
class UserRegisterView(APIView):
    def post(self, request):
        try:
            serializer = UserRegisterSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except (OperationalError, ProgrammingError):
            return Response(
                {
                    "message": "Database is not ready. Run migrations on the server and retry."
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )


# =========================
# USER LOGIN (unchanged)
# =========================
class UserLoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            return Response({
                "message": "Login successful",
                "user_id": user.id,
                "username": user.username
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# GUEST ORDER CRUD API
# =========================
class GuestOrderView(APIView):
    """
    CRUD for Guest Orders
    • POST    → create new order
    • GET     → list orders (optionally filtered by ?email=...)
    • GET(id) → retrieve single order (not used by current frontend)
    • PUT(id) → update order (optional)
    • DELETE(id) → delete order (optional)
    """

    def get(self, request, pk=None):
        if pk is None:
            # List mode: optionally filter by email
            email = request.query_params.get('email')
            queryset = GuestOrder.objects.all().order_by('-created_at')

            if email:
                queryset = queryset.filter(customer_email__iexact=email)

            serializer = GuestOrderSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Detail mode: single order
        try:
            order = GuestOrder.objects.get(pk=pk)
        except GuestOrder.DoesNotExist:
            raise NotFound("Order not found")

        serializer = GuestOrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def post(self, request):
        """Create a new guest order"""
        serializer = GuestOrderSerializer(data=request.data)
        if serializer.is_valid():
            order = serializer.save()
            return Response({
                "success": True,
                "message": "Guest order created successfully",
                "order_id": order.id,
                "amount": str(order.amount),  # string is safer for frontend
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


    def put(self, request, pk):
        """Update an existing guest order (optional feature)"""
        try:
            order = GuestOrder.objects.get(pk=pk)
        except GuestOrder.DoesNotExist:
            raise NotFound("Order not found")

        serializer = GuestOrderSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Order updated",
                "order_id": order.id,
                "amount": str(order.amount),
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, pk):
        """Delete a guest order (optional)"""
        try:
            order = GuestOrder.objects.get(pk=pk)
            order.delete()
            return Response({
                "success": True,
                "message": "Order deleted successfully"
            }, status=status.HTTP_204_NO_CONTENT)
        except GuestOrder.DoesNotExist:
            raise NotFound("Order not found")

def register(request):
    return render(request, 'register.html')
