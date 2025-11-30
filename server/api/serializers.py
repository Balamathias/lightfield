from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Associate, BlogCategory, BlogPost, AIConversation, ContactSubmission, Testimonial, Grant

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new users
    """
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class AssociateListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing associates (lighter version)
    """
    class Meta:
        model = Associate
        fields = ['id', 'name', 'slug', 'title', 'expertise', 'bio', 'image_url', 'is_active', 'order_priority', 'linkedin_url', 'twitter_url', 'phone']


class AssociateDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for associate detail view (complete data)
    """
    class Meta:
        model = Associate
        fields = '__all__'
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class AssociateWriteSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating associates
    """
    class Meta:
        model = Associate
        exclude = ['slug', 'created_at', 'updated_at']

    def validate_expertise(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Expertise must be a list")
        return value


class BlogCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for blog categories
    """
    blog_count = serializers.SerializerMethodField()

    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug', 'description', 'order_priority', 'blog_count']
        read_only_fields = ['id', 'slug']

    def get_blog_count(self, obj):
        return obj.blog_posts.filter(is_published=True).count()


class BlogCategoryWriteSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating categories
    """
    class Meta:
        model = BlogCategory
        exclude = ['slug', 'created_at', 'updated_at']


class BlogPostListSerializer(serializers.ModelSerializer):
    """
    Serializer for blog post listing
    """
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_username = serializers.CharField(source='author.username', read_only=True)
    categories = BlogCategorySerializer(many=True, read_only=True)
    read_time = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'featured_image_url',
            'author_name', 'author_username', 'categories', 'is_published',
            'is_featured', 'view_count', 'publish_date', 'created_at', 'read_time'
        ]

    def get_read_time(self, obj):
        # Estimate read time (assuming 200 words per minute)
        word_count = len(obj.content.split())
        read_time = max(1, round(word_count / 200))
        return read_time


class BlogPostDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for blog post detail view
    """
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_username = serializers.CharField(source='author.username', read_only=True)
    categories = BlogCategorySerializer(many=True, read_only=True)
    read_time = serializers.SerializerMethodField()
    related_posts = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = '__all__'
        read_only_fields = ['id', 'slug', 'view_count', 'created_at', 'updated_at']

    def get_read_time(self, obj):
        word_count = len(obj.content.split())
        read_time = max(1, round(word_count / 200))
        return read_time

    def get_related_posts(self, obj):
        # Get related posts from the same categories
        if obj.categories.exists():
            related = BlogPost.objects.filter(
                categories__in=obj.categories.all(),
                is_published=True
            ).exclude(id=obj.id).distinct()[:3]
            return BlogPostListSerializer(related, many=True).data
        return []


class BlogPostWriteSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating blog posts
    """
    category_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    author = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        required=False,
        allow_null=True
    )
    publish_date = serializers.DateTimeField(
        required=False,
        allow_null=True,
        input_formats=['iso-8601', '%Y-%m-%dT%H:%M:%S.%fZ', '%Y-%m-%dT%H:%M:%SZ']
    )

    class Meta:
        model = BlogPost
        exclude = ['slug', 'view_count', 'created_at', 'updated_at']

    def validate(self, data):
        # Ensure publish_date is set if is_published is True
        if data.get('is_published') and not data.get('publish_date'):
            from django.utils import timezone
            data['publish_date'] = timezone.now()
        return data

    def create(self, validated_data):
        category_ids = validated_data.pop('category_ids', [])
        
        # If no author provided, use the request user or a default system user
        if 'author' not in validated_data or validated_data.get('author') is None:
            # Get or create a default "LightField LP" system user
            author, _ = User.objects.get_or_create(
                username='lightfield_lp',
                defaults={
                    'first_name': 'LightField',
                    'last_name': 'LP',
                    'email': 'info@lightfield.com',
                    'is_staff': True
                }
            )
            validated_data['author'] = author
        
        blog_post = BlogPost.objects.create(**validated_data)
        if category_ids:
            blog_post.categories.set(category_ids)
        return blog_post

    def update(self, instance, validated_data):
        category_ids = validated_data.pop('category_ids', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if category_ids is not None:
            instance.categories.set(category_ids)
        return instance


class AIConversationSerializer(serializers.ModelSerializer):
    """
    Serializer for AI conversations
    """
    class Meta:
        model = AIConversation
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class AIMessageSerializer(serializers.Serializer):
    """
    Serializer for individual AI messages
    """
    role = serializers.ChoiceField(choices=['user', 'assistant'])
    content = serializers.CharField()


class ContactSubmissionSerializer(serializers.ModelSerializer):
    """
    Serializer for contact form submissions
    """
    class Meta:
        model = ContactSubmission
        fields = '__all__'
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']

    def validate_email(self, value):
        from django.core.validators import EmailValidator
        validator = EmailValidator()
        validator(value)
        return value


class ContactSubmissionListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing contact submissions (admin)
    """
    class Meta:
        model = ContactSubmission
        fields = ['id', 'name', 'email', 'subject', 'status', 'created_at', 'message', 'phone']


class TestimonialListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing testimonials (lighter version)
    """
    class Meta:
        model = Testimonial
        fields = [
            'id', 'client_name', 'client_title', 'client_company',
            'testimonial_text', 'client_image_url', 'rating', 'case_type',
            'is_featured', 'is_active', 'order_priority', 'created_at'
        ]


class TestimonialDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for testimonial detail view (complete data)
    """
    class Meta:
        model = Testimonial
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class TestimonialWriteSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating testimonials
    """
    class Meta:
        model = Testimonial
        exclude = ['created_at', 'updated_at']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value

    def validate_testimonial_text(self, value):
        if len(value) < 20:
            raise serializers.ValidationError(
                "Testimonial text must be at least 20 characters"
            )
        return value


class ReorderSerializer(serializers.Serializer):
    """
    Generic serializer for reordering items
    """
    items = serializers.ListField(
        child=serializers.DictField(child=serializers.IntegerField())
    )

    def validate_items(self, value):
        for item in value:
            if 'id' not in item or 'order_priority' not in item:
                raise serializers.ValidationError(
                    "Each item must have 'id' and 'order_priority' fields"
                )
        return value


class DashboardStatsSerializer(serializers.Serializer):
    """
    Serializer for dashboard statistics
    """
    total_blogs = serializers.IntegerField()
    published_blogs = serializers.IntegerField()
    draft_blogs = serializers.IntegerField()
    total_associates = serializers.IntegerField()
    active_associates = serializers.IntegerField()
    total_contacts = serializers.IntegerField()
    unread_contacts = serializers.IntegerField()
    total_views = serializers.IntegerField()
    total_testimonials = serializers.IntegerField()
    active_testimonials = serializers.IntegerField()
    total_grants = serializers.IntegerField()
    active_grants = serializers.IntegerField()


class GrantListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing grants (public and admin list views)
    """
    formatted_amount = serializers.ReadOnlyField()
    is_application_open = serializers.ReadOnlyField()
    days_until_deadline = serializers.SerializerMethodField()

    class Meta:
        model = Grant
        fields = [
            'id', 'title', 'slug', 'grant_type', 'amount', 'currency',
            'formatted_amount', 'short_description', 'image_url',
            'target_audience', 'application_deadline', 'status',
            'is_featured', 'is_active', 'order_priority',
            'is_application_open', 'days_until_deadline', 'created_at'
        ]

    def get_days_until_deadline(self, obj):
        """Calculate days remaining until application deadline"""
        from django.utils import timezone
        if obj.application_deadline:
            delta = obj.application_deadline - timezone.now().date()
            return max(0, delta.days)
        return None


class GrantDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for grant detail view (complete data)
    """
    formatted_amount = serializers.ReadOnlyField()
    is_application_open = serializers.ReadOnlyField()
    days_until_deadline = serializers.SerializerMethodField()

    class Meta:
        model = Grant
        fields = '__all__'
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']

    def get_days_until_deadline(self, obj):
        """Calculate days remaining until application deadline"""
        from django.utils import timezone
        if obj.application_deadline:
            delta = obj.application_deadline - timezone.now().date()
            return max(0, delta.days)
        return None


class GrantWriteSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating grants
    Minimal required fields - most are optional for display-only grants
    """
    application_deadline = serializers.DateField(
        required=False,
        allow_null=True,
        input_formats=['iso-8601', '%Y-%m-%d']
    )
    announcement_date = serializers.DateField(
        required=False,
        allow_null=True,
        input_formats=['iso-8601', '%Y-%m-%d']
    )
    amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Grant
        exclude = ['slug', 'created_at', 'updated_at']

    def to_internal_value(self, data):
        # Make a mutable copy of the data
        mutable_data = dict(data)
        # Convert empty strings to None for nullable fields
        if 'application_deadline' in mutable_data and mutable_data['application_deadline'] == '':
            mutable_data['application_deadline'] = None
        if 'announcement_date' in mutable_data and mutable_data['announcement_date'] == '':
            mutable_data['announcement_date'] = None
        if 'amount' in mutable_data and (mutable_data['amount'] == '' or mutable_data['amount'] == 0):
            mutable_data['amount'] = None
        return super().to_internal_value(mutable_data)

    def validate_eligibility_criteria(self, value):
        if value is not None and not isinstance(value, list):
            raise serializers.ValidationError("Eligibility criteria must be a list")
        return value or []

    def validate_requirements(self, value):
        if value is not None and not isinstance(value, list):
            raise serializers.ValidationError("Requirements must be a list")
        return value or []

    def validate_guidelines(self, value):
        if value is not None and not isinstance(value, list):
            raise serializers.ValidationError("Guidelines must be a list")
        return value or []

    def validate_target_institutions(self, value):
        if value is not None and not isinstance(value, list):
            raise serializers.ValidationError("Target institutions must be a list")
        return value or []

    def validate_amount(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0")
        return value


class GrantPublicListSerializer(serializers.ModelSerializer):
    """
    Serializer for public grant listing (limited fields)
    """
    formatted_amount = serializers.ReadOnlyField()
    is_application_open = serializers.ReadOnlyField()
    days_until_deadline = serializers.SerializerMethodField()

    class Meta:
        model = Grant
        fields = [
            'id', 'title', 'slug', 'grant_type', 'formatted_amount',
            'short_description', 'image_url', 'target_audience',
            'application_deadline', 'status', 'is_application_open',
            'days_until_deadline'
        ]

    def get_days_until_deadline(self, obj):
        from django.utils import timezone
        if obj.application_deadline:
            delta = obj.application_deadline - timezone.now().date()
            return max(0, delta.days)
        return None


class GrantPublicDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for public grant detail view
    """
    formatted_amount = serializers.ReadOnlyField()
    is_application_open = serializers.ReadOnlyField()
    days_until_deadline = serializers.SerializerMethodField()

    class Meta:
        model = Grant
        exclude = ['order_priority', 'is_active', 'updated_at']
        read_only_fields = ['id', 'slug', 'created_at']

    def get_days_until_deadline(self, obj):
        from django.utils import timezone
        if obj.application_deadline:
            delta = obj.application_deadline - timezone.now().date()
            return max(0, delta.days)
        return None
