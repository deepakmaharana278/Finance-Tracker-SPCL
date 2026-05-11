from django.db.models import Sum
from django.db.models.functions import TruncMonth
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Category, Transaction
from .serializers import CategorySerializer, TransactionSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.select_related('category').all()
    serializer_class = TransactionSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        type_filter = self.request.query_params.get('type')
        category = self.request.query_params.get('category')
        month = self.request.query_params.get('month')
        search = self.request.query_params.get('search')
        if type_filter:
            qs = qs.filter(type=type_filter)
        if category:
            qs = qs.filter(category_id=category)
        if month:
            year, m = month.split('-')
            qs = qs.filter(date__year=year, date__month=m)
        if search:
            qs = qs.filter(title__icontains=search)
        return qs

