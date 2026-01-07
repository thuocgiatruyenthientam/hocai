from django.test import TestCase
from django.urls import reverse

from .models import HerbalCategory, HerbalProduct


class ProductViewTests(TestCase):
    def setUp(self):
        category = HerbalCategory.objects.create(name="Thảo dược")
        HerbalProduct.objects.create(
            name="Nhân sâm",
            scientific_name="Panax ginseng",
            category=category,
            price=1000000,
            stock=5,
            meta_title="Nhân sâm bồi bổ sức khỏe",
            meta_description="Thông tin Nhân sâm Panax ginseng và lợi ích sức khỏe.",
            meta_keywords="nhan sam, panax ginseng, boi bo",
        )

    def test_product_list_renders(self):
        response = self.client.get(reverse("product_list"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Nhân sâm")

    def test_slug_auto_generates(self):
        product = HerbalProduct.objects.get(name="Nhân sâm")
        self.assertTrue(product.slug)
        self.assertIn("nhan-sam", product.slug)
