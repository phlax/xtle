# Generated by Django 3.0.3 on 2020-02-18 19:09

from django.db import migrations, models
import django.db.models.deletion
import sortedm2m.fields
import xtle.core.mixins.treeitem
import xtle.project.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('xtle_app', '0001_initial'),
        ('xtle_format', '0001_initial'),
        ('xtle_language', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(db_index=True, help_text='A short code for the project. This should only contain ASCII characters, numbers, and the underscore (_) character.', max_length=255, unique=True, validators=[xtle.project.models.validate_not_reserved], verbose_name='Code')),
                ('fullname', models.CharField(max_length=255, verbose_name='Full Name')),
                ('checkstyle', models.CharField(default='standard', max_length=50, validators=[xtle.project.models.validate_project_checker], verbose_name='Quality Checks')),
                ('ignoredfiles', models.CharField(blank=True, default='', max_length=255, verbose_name='Ignore Files')),
                ('report_email', models.EmailField(blank=True, help_text='An email address where issues with the source text can be reported.', max_length=254, verbose_name='Errors Report Email')),
                ('screenshot_search_prefix', models.URLField(blank=True, null=True, verbose_name='Screenshot Search Prefix')),
                ('creation_time', models.DateTimeField(auto_now_add=True, db_index=True, null=True)),
                ('disabled', models.BooleanField(default=False, verbose_name='Disabled')),
                ('directory', models.OneToOneField(editable=False, on_delete=django.db.models.deletion.CASCADE, to='xtle_app.Directory')),
                ('filetypes', sortedm2m.fields.SortedManyToManyField(help_text=None, to='xtle_format.Format')),
                ('source_language', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='xtle_language.Language', verbose_name='Source Language')),
            ],
            options={
                'db_table': 'xtle_app_project',
                'ordering': ['code'],
            },
            bases=(models.Model, xtle.core.mixins.treeitem.CachedTreeItem, xtle.project.models.ProjectURLMixin),
        ),
    ]
