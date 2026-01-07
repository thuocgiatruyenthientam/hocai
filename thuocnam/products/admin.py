from django.contrib import admin

from .models import HerbalCategory, HerbalProduct


@admin.register(HerbalCategory)
class HerbalCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name",)


@admin.register(HerbalProduct)
class HerbalProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "price",
        "stock",
        "origin",
        "meta_title",
        "slug",
    )
    list_filter = ("category",)
    search_fields = ("name", "scientific_name", "origin", "meta_keywords")
    autocomplete_fields = ("category",)
    prepopulated_fields = {"slug": ("name",)}
    fieldsets = (
        (None, {"fields": ("name", "slug", "category", "scientific_name", "description")}),
        ("Thông tin sử dụng", {"fields": ("usage", "dosage", "origin")}),
        (
            "SEO",
            {
                "classes": ("collapse",),
                "fields": (
                    "meta_title",
                    "meta_description",
                    "meta_keywords",
                ),
            },
        ),
        ("Giá và tồn kho", {"fields": ("price", "stock")}),
        ("Theo dõi", {"fields": ("created_at", "updated_at"), "classes": ("collapse",)}),
    )
    readonly_fields = ("created_at", "updated_at")
