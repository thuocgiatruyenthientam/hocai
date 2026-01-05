from django.contrib import admin

from .models import HerbalCategory, HerbalProduct


@admin.register(HerbalCategory)
class HerbalCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name",)


@admin.register(HerbalProduct)
class HerbalProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "stock", "origin")
    list_filter = ("category",)
    search_fields = ("name", "scientific_name", "origin")
    autocomplete_fields = ("category",)
