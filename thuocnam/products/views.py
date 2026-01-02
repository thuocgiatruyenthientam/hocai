from django.shortcuts import render

from .models import HerbalProduct


def product_list(request):
    products = HerbalProduct.objects.select_related("category").all()
    return render(request, "products/list.html", {"products": products})
