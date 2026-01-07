from django.db import models
from django.utils.text import slugify


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
    slug = models.SlugField(max_length=160, unique=True, blank=True)
    scientific_name = models.CharField(max_length=150, blank=True)
    category = models.ForeignKey(
        HerbalCategory, on_delete=models.CASCADE, related_name="products"
    )
    description = models.TextField(blank=True)
    usage = models.TextField(blank=True)
    dosage = models.CharField(max_length=100, blank=True)
    origin = models.CharField(max_length=100, blank=True)
    meta_title = models.CharField(max_length=150, blank=True)
    meta_description = models.CharField(max_length=255, blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True)
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

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name) or "herbal-product"
            slug = base_slug
            counter = 1
            while HerbalProduct.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                counter += 1
                slug = f"{base_slug}-{counter}"
            self.slug = slug
        super().save(*args, **kwargs)
