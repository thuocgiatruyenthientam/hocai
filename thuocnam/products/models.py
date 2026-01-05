from django.db import models


class HerbalCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = "Danh mục"
        verbose_name_plural = "Danh mục"

    def __str__(self) -> str:
        return self.name


class HerbalProduct(models.Model):
    name = models.CharField(max_length=150)
    scientific_name = models.CharField(max_length=150, blank=True)
    category = models.ForeignKey(
        HerbalCategory, on_delete=models.CASCADE, related_name="products"
    )
    description = models.TextField(blank=True)
    usage = models.TextField(blank=True)
    dosage = models.CharField(max_length=100, blank=True)
    origin = models.CharField(max_length=100, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Bài thuốc"
        verbose_name_plural = "Bài thuốc"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name
