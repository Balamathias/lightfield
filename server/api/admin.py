from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, Associate, BlogCategory, BlogPost, AIConversation,
    ContactSubmission, Grant, ConsultationService, ConsultationBooking
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom User admin
    """
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'date_joined']
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-date_joined']


@admin.register(Associate)
class AssociateAdmin(admin.ModelAdmin):
    """
    Associate admin with ordering and filters
    """
    list_display = ['name', 'title', 'is_active', 'order_priority', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'title', 'bio']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order_priority', '-created_at']
    list_editable = ['order_priority', 'is_active']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'title', 'bio', 'expertise')
        }),
        ('Contact & Social', {
            'fields': ('email', 'phone', 'linkedin_url', 'twitter_url')
        }),
        ('Media', {
            'fields': ('image_url',)
        }),
        ('Status & Priority', {
            'fields': ('is_active', 'order_priority')
        }),
    )


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    """
    Blog Category admin
    """
    list_display = ['name', 'slug', 'order_priority', 'blog_count']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order_priority', 'name']
    list_editable = ['order_priority']

    def blog_count(self, obj):
        return obj.blog_posts.filter(is_published=True).count()
    blog_count.short_description = 'Published Blogs'


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    """
    Blog Post admin with rich features
    """
    list_display = ['title', 'author', 'is_published', 'is_featured', 'view_count', 'publish_date', 'order_priority']
    list_filter = ['is_published', 'is_featured', 'publish_date', 'created_at', 'categories']
    search_fields = ['title', 'excerpt', 'content', 'meta_keywords']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['categories']
    ordering = ['order_priority', '-publish_date', '-created_at']
    list_editable = ['is_published', 'is_featured', 'order_priority']
    date_hierarchy = 'publish_date'

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'excerpt', 'content', 'author')
        }),
        ('Categorization', {
            'fields': ('categories',)
        }),
        ('Media', {
            'fields': ('featured_image_url',)
        }),
        ('SEO', {
            'fields': ('meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
        ('AI Features', {
            'fields': ('ai_overview',),
            'classes': ('collapse',)
        }),
        ('Status & Priority', {
            'fields': ('is_published', 'is_featured', 'order_priority', 'publish_date')
        }),
        ('Statistics', {
            'fields': ('view_count',),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ['view_count']

    def save_model(self, request, obj, form, change):
        if not change:  # If creating new blog post
            obj.author = request.user
        super().save_model(request, obj, form, change)


@admin.register(AIConversation)
class AIConversationAdmin(admin.ModelAdmin):
    """
    AI Conversation admin
    """
    list_display = ['session_id', 'message_count', 'created_at', 'updated_at']
    search_fields = ['session_id']
    readonly_fields = ['session_id', 'messages', 'created_at', 'updated_at']
    ordering = ['-updated_at']

    def message_count(self, obj):
        return len(obj.messages) if isinstance(obj.messages, list) else 0
    message_count.short_description = 'Messages'

    def has_add_permission(self, request):
        return False


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    """
    Contact Submission admin
    """
    list_display = ['name', 'email', 'subject', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['name', 'email', 'phone', 'subject', 'message', 'created_at']
    ordering = ['-created_at']
    list_editable = ['status']

    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Message', {
            'fields': ('subject', 'message')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Metadata', {
            'fields': ('created_at',)
        }),
    )

    def has_add_permission(self, request):
        return False


@admin.register(Grant)
class GrantAdmin(admin.ModelAdmin):
    """
    Grant & Scholarship admin with comprehensive management
    """
    list_display = [
        'title', 'grant_type', 'formatted_amount', 'status',
        'is_featured', 'is_active', 'application_deadline', 'order_priority'
    ]
    list_filter = ['grant_type', 'status', 'is_featured', 'is_active', 'created_at']
    search_fields = ['title', 'short_description', 'full_description', 'target_audience']
    prepopulated_fields = {'slug': ('title',)}
    ordering = ['order_priority', '-created_at']
    list_editable = ['status', 'is_featured', 'is_active', 'order_priority']
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'grant_type', 'short_description', 'full_description')
        }),
        ('Amount & Value', {
            'fields': ('amount', 'currency')
        }),
        ('Target Audience', {
            'fields': ('target_audience', 'target_institutions')
        }),
        ('Requirements & Eligibility', {
            'fields': ('eligibility_criteria', 'requirements', 'guidelines')
        }),
        ('Application Details', {
            'fields': ('how_to_apply', 'application_email', 'application_url')
        }),
        ('Important Dates', {
            'fields': ('application_deadline', 'announcement_date')
        }),
        ('Media', {
            'fields': ('image_url', 'banner_image_url')
        }),
        ('Social Links', {
            'fields': ('social_links',),
            'classes': ('collapse',)
        }),
        ('Status & Priority', {
            'fields': ('status', 'is_featured', 'is_active', 'order_priority')
        }),
    )

    def formatted_amount(self, obj):
        return obj.formatted_amount
    formatted_amount.short_description = 'Amount'


@admin.register(ConsultationService)
class ConsultationServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'formatted_price', 'duration_minutes', 'is_active', 'is_featured', 'order_priority']
    list_filter = ['category', 'is_active', 'is_featured']
    search_fields = ['name', 'description', 'short_description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order_priority', '-created_at']
    list_editable = ['is_active', 'is_featured', 'order_priority']

    def formatted_price(self, obj):
        return obj.formatted_price
    formatted_price.short_description = 'Price'


@admin.register(ConsultationBooking)
class ConsultationBookingAdmin(admin.ModelAdmin):
    list_display = ['reference', 'client_name', 'service_name', 'formatted_amount', 'status', 'payment_verified', 'preferred_date', 'created_at']
    list_filter = ['status', 'payment_verified', 'preferred_date', 'created_at']
    search_fields = ['reference', 'client_name', 'client_email', 'client_phone']
    readonly_fields = ['reference', 'paystack_reference', 'paystack_access_code', 'payment_verified', 'payment_verified_at', 'payment_channel', 'created_at', 'updated_at']
    ordering = ['-created_at']
    list_editable = ['status']

    def service_name(self, obj):
        return obj.service_name
    service_name.short_description = 'Service'

    def formatted_amount(self, obj):
        return obj.formatted_amount
    formatted_amount.short_description = 'Amount'


# Customize admin site header and title
admin.site.site_header = "LightField Legal Practitioners Admin"
admin.site.site_title = "LightField Admin Portal"
admin.site.index_title = "Welcome to LightField Administration"
