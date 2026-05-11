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


@api_view(['GET'])
def summary(req):
    income  = Transaction.objects.filter(type='income').aggregate(total=Sum('amount'))['total'] or 0
    expense = Transaction.objects.filter(type='expense').aggregate(total=Sum('amount'))['total'] or 0
    top_categories = (
        Transaction.objects.filter(type='expense')
        .values('category__name')
        .annotate(total=Sum('amount'))
        .order_by('-total')[:5]
    )
    return Response({
        'income': float(income),
        'expense': float(expense),
        'balance': float(income - expense),
        'top_categories': list(top_categories),
    })
 
 
@api_view(['GET'])
def monthly_breakdown(req):
    income_qs = (
        Transaction.objects.filter(type='income')
        .annotate(month=TruncMonth('date'))
        .values('month').annotate(total=Sum('amount')).order_by('month')
    )
    expense_qs = (
        Transaction.objects.filter(type='expense')
        .annotate(month=TruncMonth('date'))
        .values('month').annotate(total=Sum('amount')).order_by('month')
    )
    income_map = {str(r['month'])[:7]: float(r['total']) for r in income_qs}
    expense_map = {str(r['month'])[:7]: float(r['total']) for r in expense_qs}
    months = sorted(set(list(income_map) + list(expense_map)))[-6:]
    return Response([
        {'month': m, 'income': income_map.get(m, 0), 'expense': expense_map.get(m, 0)}
        for m in months
    ])