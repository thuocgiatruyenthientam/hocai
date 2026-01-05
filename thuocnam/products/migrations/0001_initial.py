from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="HerbalCategory",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=100)),
                ("description", models.TextField(blank=True)),
            ],
            options={
                "verbose_name": "Danh mục",
                "verbose_name_plural": "Danh mục",
            },
        ),
        migrations.CreateModel(
            name="HerbalProduct",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=150)),
                ("scientific_name", models.CharField(blank=True, max_length=150)),
                ("description", models.TextField(blank=True)),
                ("usage", models.TextField(blank=True)),
                ("dosage", models.CharField(blank=True, max_length=100)),
                ("origin", models.CharField(blank=True, max_length=100)),
                ("price", models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ("stock", models.PositiveIntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "category",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="products",
                        to="products.herbalcategory",
                    ),
                ),
            ],
            options={
                "verbose_name": "Bài thuốc",
                "verbose_name_plural": "Bài thuốc",
                "ordering": ["name"],
            },
        ),
    ]
