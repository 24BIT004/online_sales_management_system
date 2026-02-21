# App1/admin.py
from django.contrib import admin
from .models import GuestOrder

@admin.register(GuestOrder)
class GuestOrderAdmin(admin.ModelAdmin):
    # Columns to display in admin list view
    list_display = (
        'id',
        'customer_name',
        'product_name',
        'quantity',
        'amount',
        'payment_method',
        'is_paid',
        'delivery_date',
        'created_at',
    )

    # Filters for the right sidebar
    list_filter = (
        'payment_method',
        'is_paid',
        'delivery_date',
        'created_at',
    )

    # Searchable fields
    search_fields = (
        'customer_name',
        'customer_email',
        'product_name',
    )

    # Default ordering (latest first)
    ordering = ('-created_at',)

    # Fields that should not be editable in admin
    readonly_fields = (
        'amount',
        'created_at',
    )
