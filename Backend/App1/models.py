# App1/models.py
from django.db import models

# Payment methods are now only for frontend display; backend won't enforce anything
PAYMENT_METHODS = [
    ('phone', 'Phone Payment'),
    ('control_number', 'Control Number'),
]

class GuestOrder(models.Model):
    # Customer info
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField(blank=True, null=True)
    
    # Product info
    product_name = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Delivery info
    delivery_date = models.DateField(blank=True, null=True)
    delivery_address = models.CharField(max_length=255)
    
    # Payment info (simplified)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default='phone')
    amount = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Calculate amount automatically
        if self.amount is None:
            self.amount = self.quantity * self.price_per_unit
        super().save(*args, **kwargs)

    def __str__(self):
        return f"GuestOrder #{self.id} - {self.customer_name}"
