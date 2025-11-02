from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser
    Uses built-in is_superuser for full admin access
    Uses built-in is_staff for staff access (can be configured later)
    """
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']

    def __str__(self):
        return self.username


class Associate(models.Model):
    """
    Model for law firm associates/team members
    """
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    title = models.CharField(max_length=255, help_text="e.g., 'Senior Partner', 'Associate'")
    bio = models.TextField()
    expertise = models.JSONField(default=list, help_text="List of expertise areas")
    image_url = models.URLField(blank=True, null=True, help_text="Cloudinary URL")
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)

    linkedin_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)

    order_priority = models.IntegerField(default=0, help_text="Lower numbers appear first")
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'associates'
        ordering = ['order_priority', '-created_at']
        verbose_name = 'Associate'
        verbose_name_plural = 'Associates'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.title}"


class BlogCategory(models.Model):
    """
    Model for blog categories
    """
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    order_priority = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'blog_categories'
        ordering = ['order_priority', 'name']
        verbose_name = 'Blog Category'
        verbose_name_plural = 'Blog Categories'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class BlogPost(models.Model):
    """
    Model for blog posts
    """
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    excerpt = models.TextField(max_length=500, help_text="Short summary of the blog post")
    content = models.TextField()

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    categories = models.ManyToManyField(BlogCategory, related_name='blog_posts', blank=True)

    featured_image_url = models.URLField(blank=True, null=True, help_text="Cloudinary URL")

    meta_description = models.CharField(max_length=160, blank=True, null=True)
    meta_keywords = models.CharField(max_length=255, blank=True, null=True)

    ai_overview = models.TextField(blank=True, null=True, help_text="AI-generated summary")

    is_published = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    order_priority = models.IntegerField(default=0, help_text="Lower numbers appear first")

    view_count = models.IntegerField(default=0)

    publish_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'blog_posts'
        ordering = ['order_priority', '-publish_date', '-created_at']
        verbose_name = 'Blog Post'
        verbose_name_plural = 'Blog Posts'
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['-publish_date']),
            models.Index(fields=['is_published']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def increment_view_count(self):
        self.view_count += 1
        self.save(update_fields=['view_count'])

    def __str__(self):
        return self.title


class AIConversation(models.Model):
    """
    Model for storing Solo AI assistant conversations
    """
    session_id = models.CharField(max_length=255, unique=True, db_index=True)
    messages = models.JSONField(default=list, help_text="List of message objects")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ai_conversations'
        ordering = ['-updated_at']
        verbose_name = 'AI Conversation'
        verbose_name_plural = 'AI Conversations'

    def add_message(self, role, content):
        """
        Add a message to the conversation
        role: 'user' or 'assistant'
        """
        from django.utils import timezone
        message = {
            'role': role,
            'content': content,
            'timestamp': timezone.now().isoformat()
        }
        if not isinstance(self.messages, list):
            self.messages = []
        self.messages.append(message)
        self.save()

    def __str__(self):
        return f"Conversation {self.session_id}"


class ContactSubmission(models.Model):
    """
    Model for contact form submissions
    """
    STATUS_CHOICES = [
        ('unread', 'Unread'),
        ('read', 'Read'),
        ('responded', 'Responded'),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True, null=True)
    subject = models.CharField(max_length=255)
    message = models.TextField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unread')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'contact_submissions'
        ordering = ['-created_at']
        verbose_name = 'Contact Submission'
        verbose_name_plural = 'Contact Submissions'

    def mark_as_read(self):
        self.status = 'read'
        self.save()

    def __str__(self):
        return f"{self.name} - {self.subject}"
