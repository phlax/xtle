# Generated by Django 3.0.3 on 2020-02-18 16:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FileExtension',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=15, unique=True, verbose_name='Format filetype extension')),
            ],
            options={
                'db_table': 'xtle_fileextension',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Format',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=30, unique=True, verbose_name='Format name')),
                ('title', models.CharField(max_length=255, verbose_name='Format title')),
                ('enabled', models.BooleanField(default=True, verbose_name='Enabled')),
                ('monolingual', models.BooleanField(default=False, verbose_name='Monolingual format')),
                ('extension', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='formats', to='xtle_format.FileExtension')),
                ('template_extension', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='template_formats', to='xtle_format.FileExtension')),
            ],
            options={
                'db_table': 'xtle_format',
                'abstract': False,
                'unique_together': {('title', 'extension')},
            },
        ),
    ]
