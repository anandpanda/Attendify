# Generated by Django 4.1.13 on 2024-09-12 21:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('image_handler', '0003_attendanceimage_delete_uploadedimage'),
    ]

    operations = [
        migrations.DeleteModel(
            name='AttendanceImage',
        ),
    ]