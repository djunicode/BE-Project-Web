# Generated by Django 2.1.4 on 2019-01-02 13:42

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Teacher',
            fields=[
                ('teacher_id', models.AutoField(primary_key=True, serialize=False)),
                ('teacher_name', models.CharField(max_length=25)),
                ('username', models.CharField(max_length=25)),
                ('password', models.CharField(max_length=256)),
                ('subject', models.CharField(max_length=25)),
            ],
        ),
    ]
