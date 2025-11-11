from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Q, Count, Sum
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.http import StreamingHttpResponse
import json

from .models import Associate, BlogCategory, BlogPost, AIConversation, ContactSubmission, Testimonial, User
from .serializers import (
    AssociateListSerializer, AssociateDetailSerializer, AssociateWriteSerializer,
    BlogCategorySerializer, BlogCategoryWriteSerializer,
    BlogPostListSerializer, BlogPostDetailSerializer, BlogPostWriteSerializer,
    AIConversationSerializer, AIMessageSerializer,
    ContactSubmissionSerializer, ContactSubmissionListSerializer,
    TestimonialListSerializer, TestimonialDetailSerializer, TestimonialWriteSerializer,
    ReorderSerializer, DashboardStatsSerializer, UserSerializer
)
from .permissions import IsAdminOrReadOnly, IsStaffOrSuperUser


# ==================== Authentication Views ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    User login endpoint
    Returns JWT tokens on successful authentication
    """
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Please provide both username and password'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not (user.is_staff or user.is_superuser):
        return Response(
            {'error': 'Unauthorized access'},
            status=status.HTTP_403_FORBIDDEN
        )

    refresh = RefreshToken.for_user(user)
    user_data = UserSerializer(user).data

    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': user_data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    User logout endpoint
    Blacklists the refresh token
    """
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ==================== Associates Views ====================

@api_view(['GET', 'POST'])
@permission_classes([IsAdminOrReadOnly])
def associates_list_create(request):
    """
    GET: List all active associates (public)
    POST: Create new associate (admin only)
    """
    if request.method == 'GET':
        # Get query parameters
        search = request.query_params.get('search', '')
        is_active = request.query_params.get('is_active', 'true')

        # Build queryset
        queryset = Associate.objects.all()

        # Filter by active status
        if is_active.lower() == 'true':
            queryset = queryset.filter(is_active=True)

        # Search filter
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(title__icontains=search) |
                Q(bio__icontains=search)
            )

        serializer = AssociateListSerializer(queryset, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = AssociateWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAdminOrReadOnly])
def associate_detail(request, slug):
    """
    GET: Retrieve associate detail (public)
    PUT/PATCH: Update associate (admin only)
    DELETE: Delete associate (admin only)
    """
    associate = get_object_or_404(Associate, slug=slug)

    if request.method == 'GET':
        serializer = AssociateDetailSerializer(associate)
        return Response(serializer.data)

    elif request.method in ['PUT', 'PATCH']:
        partial = request.method == 'PATCH'
        serializer = AssociateWriteSerializer(associate, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        associate.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsStaffOrSuperUser])
def reorder_associates(request):
    """
    Reorder associates by updating their order_priority
    Expects: { "items": [{"id": 1, "order_priority": 0}, {"id": 2, "order_priority": 1}, ...] }
    """
    serializer = ReorderSerializer(data=request.data)
    if serializer.is_valid():
        for item in serializer.validated_data['items']:
            Associate.objects.filter(id=item['id']).update(order_priority=item['order_priority'])
        return Response({'message': 'Associates reordered successfully'})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==================== Blog Categories Views ====================

@api_view(['GET', 'POST'])
@permission_classes([IsAdminOrReadOnly])
def categories_list_create(request):
    """
    GET: List all categories (public)
    POST: Create new category (admin only)
    """
    if request.method == 'GET':
        categories = BlogCategory.objects.all()
        serializer = BlogCategorySerializer(categories, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = BlogCategoryWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAdminOrReadOnly])
def category_detail(request, pk):
    """
    GET: Retrieve category detail (public)
    PUT/PATCH: Update category (admin only)
    DELETE: Delete category (admin only)
    """
    category = get_object_or_404(BlogCategory, pk=pk)

    if request.method == 'GET':
        serializer = BlogCategorySerializer(category)
        return Response(serializer.data)

    elif request.method in ['PUT', 'PATCH']:
        partial = request.method == 'PATCH'
        serializer = BlogCategoryWriteSerializer(category, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsStaffOrSuperUser])
def reorder_categories(request):
    """
    Reorder categories by updating their order_priority
    Expects: { "items": [{"id": 1, "order_priority": 0}, {"id": 2, "order_priority": 1}, ...] }
    """
    serializer = ReorderSerializer(data=request.data)
    if serializer.is_valid():
        for item in serializer.validated_data['items']:
            BlogCategory.objects.filter(id=item['id']).update(order_priority=item['order_priority'])
        return Response({'message': 'Categories reordered successfully'})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==================== Blog Posts Views ====================

@api_view(['GET', 'POST'])
@permission_classes([IsAdminOrReadOnly])
def blogs_list_create(request):
    """
    GET: List published blogs (public) or all blogs (admin)
    POST: Create new blog post (admin only)
    """
    if request.method == 'GET':
        # Query parameters
        search = request.query_params.get('search', '')
        category = request.query_params.get('category', '')
        is_featured = request.query_params.get('is_featured', '')
        ordering = request.query_params.get('ordering', '-publish_date')

        # Build queryset
        queryset = BlogPost.objects.all()

        # If not admin, show only published posts
        if not (request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)):
            queryset = queryset.filter(is_published=True, publish_date__lte=timezone.now())

        # Filters
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(excerpt__icontains=search) |
                Q(content__icontains=search)
            )

        if category:
            queryset = queryset.filter(categories__slug=category)

        if is_featured:
            queryset = queryset.filter(is_featured=True)

        # Ordering
        queryset = queryset.order_by(ordering).distinct()

        # Pagination
        paginator = PageNumberPagination()
        paginator.page_size = request.query_params.get('page_size', 20)
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        serializer = BlogPostListSerializer(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)

    elif request.method == 'POST':
        serializer = BlogPostWriteSerializer(data=request.data)
        if serializer.is_valid():
            # Author will be set by serializer to default "LightField LP" if not provided
            blog_post = serializer.save()

            # Auto-generate AI overview if not provided and content exists
            if not blog_post.ai_overview and blog_post.content:
                try:
                    ai_service = get_ai_service()
                    blog_post.ai_overview = ai_service.generate_overview(
                        blog_post.title,
                        blog_post.content
                    )
                    blog_post.save(update_fields=['ai_overview'])
                except Exception as e:
                    # Log error but don't fail the request
                    print(f"Failed to generate AI overview: {str(e)}")

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Format errors for better readability
        formatted_errors = {}
        for field, errors in serializer.errors.items():
            if isinstance(errors, list) and len(errors) > 0:
                formatted_errors[field] = str(errors[0])
            else:
                formatted_errors[field] = str(errors)

        return Response(formatted_errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAdminOrReadOnly])
def blog_detail(request, slug):
    """
    GET: Retrieve blog detail and increment view count (public)
    PUT/PATCH: Update blog (admin only)
    DELETE: Delete blog (admin only)
    """
    blog = get_object_or_404(BlogPost, slug=slug)

    # Check if blog is published for non-admin users
    if request.method == 'GET':
        if not (request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)):
            if not blog.is_published or (blog.publish_date and blog.publish_date > timezone.now()):
                return Response(
                    {'error': 'Blog post not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

        # Increment view count for public access
        if not request.user.is_authenticated or not (request.user.is_staff or request.user.is_superuser):
            blog.increment_view_count()

        serializer = BlogPostDetailSerializer(blog)
        return Response(serializer.data)

    elif request.method in ['PUT', 'PATCH']:
        partial = request.method == 'PATCH'
        old_content = blog.content
        serializer = BlogPostWriteSerializer(blog, data=request.data, partial=partial)
        if serializer.is_valid():
            updated_blog = serializer.save()

            # Regenerate AI overview if:
            # 1. Content has changed significantly, OR
            # 2. Client explicitly requests regeneration via 'regenerate_ai_overview' param, OR
            # 3. No AI overview exists yet
            regenerate = request.data.get('regenerate_ai_overview', False)
            content_changed = old_content != updated_blog.content

            if (not updated_blog.ai_overview or regenerate or (content_changed and len(updated_blog.content) > 100)):
                try:
                    ai_service = get_ai_service()
                    updated_blog.ai_overview = ai_service.generate_overview(
                        updated_blog.title,
                        updated_blog.content
                    )
                    updated_blog.save(update_fields=['ai_overview'])
                except Exception as e:
                    # Log error but don't fail the request
                    print(f"Failed to regenerate AI overview: {str(e)}")

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        blog.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsStaffOrSuperUser])
def reorder_blogs(request):
    """
    Reorder blogs by updating their order_priority
    """
    serializer = ReorderSerializer(data=request.data)
    if serializer.is_valid():
        for item in serializer.validated_data['items']:
            BlogPost.objects.filter(id=item['id']).update(order_priority=item['order_priority'])
        return Response({'message': 'Blogs reordered successfully'})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==================== Contact Submissions Views ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def submit_contact(request):
    """
    Submit contact form (public)
    """
    serializer = ContactSubmissionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'message': 'Contact form submitted successfully'},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsStaffOrSuperUser])
def list_contacts(request):
    """
    List all contact submissions (admin only)
    """
    status_filter = request.query_params.get('status', '')
    search = request.query_params.get('search', '')

    queryset = ContactSubmission.objects.all()

    if status_filter:
        queryset = queryset.filter(status=status_filter)

    if search:
        queryset = queryset.filter(
            Q(name__icontains=search) |
            Q(email__icontains=search) |
            Q(subject__icontains=search)
        )

    serializer = ContactSubmissionListSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['GET', 'PATCH'])
@permission_classes([IsStaffOrSuperUser])
def contact_detail(request, pk):
    """
    GET: Retrieve contact submission detail
    PATCH: Update contact status
    """
    contact = get_object_or_404(ContactSubmission, pk=pk)

    if request.method == 'GET':
        serializer = ContactSubmissionSerializer(contact)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        new_status = request.data.get('status')
        if new_status in ['read', 'responded']:
            contact.status = new_status
            contact.save()
            return Response({'message': 'Contact status updated'})
        return Response(
            {'error': 'Invalid status'},
            status=status.HTTP_400_BAD_REQUEST
        )


# ==================== Testimonials Views ====================

@api_view(['GET', 'POST'])
@permission_classes([IsAdminOrReadOnly])
def testimonials_list_create(request):
    """
    GET: List all active testimonials (public) or all testimonials (admin)
    POST: Create new testimonial (admin only)
    """
    if request.method == 'GET':
        # Get query parameters
        is_featured = request.query_params.get('is_featured', '')
        is_active = request.query_params.get('is_active', 'true')

        # Build queryset
        queryset = Testimonial.objects.all()

        # If not admin, show only active testimonials
        if not (request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)):
            queryset = queryset.filter(is_active=True)

        # Filters
        if is_featured:
            queryset = queryset.filter(is_featured=True)

        if is_active.lower() == 'true':
            queryset = queryset.filter(is_active=True)
        elif is_active.lower() == 'false':
            queryset = queryset.filter(is_active=False)

        serializer = TestimonialListSerializer(queryset, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TestimonialWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAdminOrReadOnly])
def testimonial_detail(request, pk):
    """
    GET: Retrieve testimonial detail (public)
    PUT/PATCH: Update testimonial (admin only)
    DELETE: Delete testimonial (admin only)
    """
    testimonial = get_object_or_404(Testimonial, pk=pk)

    # Check if testimonial is active for non-admin users
    if request.method == 'GET':
        if not (request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)):
            if not testimonial.is_active:
                return Response(
                    {'error': 'Testimonial not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

        serializer = TestimonialDetailSerializer(testimonial)
        return Response(serializer.data)

    elif request.method in ['PUT', 'PATCH']:
        partial = request.method == 'PATCH'
        serializer = TestimonialWriteSerializer(testimonial, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        testimonial.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsStaffOrSuperUser])
def reorder_testimonials(request):
    """
    Reorder testimonials by updating their order_priority
    Expects: { "items": [{"id": 1, "order_priority": 0}, {"id": 2, "order_priority": 1}, ...] }
    """
    serializer = ReorderSerializer(data=request.data)
    if serializer.is_valid():
        for item in serializer.validated_data['items']:
            Testimonial.objects.filter(id=item['id']).update(order_priority=item['order_priority'])
        return Response({'message': 'Testimonials reordered successfully'})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==================== Dashboard Stats View ====================

@api_view(['GET'])
@permission_classes([IsStaffOrSuperUser])
def dashboard_stats(request):
    """
    Get dashboard statistics (admin only)
    """
    stats = {
        'total_blogs': BlogPost.objects.count(),
        'published_blogs': BlogPost.objects.filter(is_published=True).count(),
        'draft_blogs': BlogPost.objects.filter(is_published=False).count(),
        'total_associates': Associate.objects.count(),
        'active_associates': Associate.objects.filter(is_active=True).count(),
        'total_contacts': ContactSubmission.objects.count(),
        'unread_contacts': ContactSubmission.objects.filter(status='unread').count(),
        'total_views': BlogPost.objects.aggregate(Sum('view_count'))['view_count__sum'] or 0,
        'total_testimonials': Testimonial.objects.count(),
        'active_testimonials': Testimonial.objects.filter(is_active=True).count(),
    }

    serializer = DashboardStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsStaffOrSuperUser])
def blog_views_over_time(request):
    """
    Get blog views data over time for area chart
    Returns aggregated view counts by date
    """
    from django.db.models.functions import TruncDate
    from datetime import timedelta

    # Get date range (last 30 days by default)
    days = int(request.GET.get('days', 30))
    end_date = timezone.now()
    start_date = end_date - timedelta(days=days)

    # Aggregate by publish_date
    views_data = (
        BlogPost.objects
        .filter(publish_date__gte=start_date, publish_date__lte=end_date, is_published=True)
        .annotate(date=TruncDate('publish_date'))
        .values('date')
        .annotate(views=Sum('view_count'))
        .order_by('date')
    )

    # Format for recharts
    chart_data = [
        {
            'date': item['date'].strftime('%Y-%m-%d'),
            'views': item['views'] or 0
        }
        for item in views_data
    ]

    return Response(chart_data)


@api_view(['GET'])
@permission_classes([IsStaffOrSuperUser])
def posts_over_time(request):
    """
    Get blog posts published over time for area chart
    Returns count of posts by date
    """
    from django.db.models.functions import TruncDate
    from datetime import timedelta

    # Get date range (last 30 days by default)
    days = int(request.GET.get('days', 30))
    end_date = timezone.now()
    start_date = end_date - timedelta(days=days)

    posts_data = (
        BlogPost.objects
        .filter(publish_date__gte=start_date, publish_date__lte=end_date, is_published=True)
        .annotate(date=TruncDate('publish_date'))
        .values('date')
        .annotate(count=Count('id'))
        .order_by('date')
    )

    # Format for recharts
    chart_data = [
        {
            'date': item['date'].strftime('%Y-%m-%d'),
            'posts': item['count']
        }
        for item in posts_data
    ]

    return Response(chart_data)


@api_view(['GET'])
@permission_classes([IsStaffOrSuperUser])
def posts_by_category(request):
    """
    Get blog posts count by category for bar chart
    """
    category_data = (
        BlogCategory.objects
        .annotate(post_count=Count('blog_posts', filter=Q(blog_posts__is_published=True)))
        .filter(post_count__gt=0)
        .order_by('-post_count')
    )

    # Format for recharts
    chart_data = [
        {
            'category': cat.name,
            'posts': cat.post_count
        }
        for cat in category_data
    ]

    return Response(chart_data)


@api_view(['GET'])
@permission_classes([IsStaffOrSuperUser])
def contacts_by_status(request):
    """
    Get contact submissions by status for pie chart
    """
    status_data = (
        ContactSubmission.objects
        .values('status')
        .annotate(count=Count('id'))
        .order_by('status')
    )

    # Format for recharts with proper labels
    status_labels = {
        'pending': 'Pending',
        'reviewed': 'Reviewed',
        'responded': 'Responded'
    }

    chart_data = [
        {
            'status': status_labels.get(item['status'], item['status'].title()),
            'value': item['count'],
            'rawStatus': item['status']
        }
        for item in status_data
    ]

    return Response(chart_data)


# ==================== AI Features Views ====================

from .ai_service import get_ai_service


@api_view(['POST'])
@permission_classes([AllowAny])
def solo_chat(request):
    """
    Solo AI assistant chat endpoint with streaming support (public)
    Expects: { "message": "user question", "session_id": "session_id" (optional) }
    Returns: Streaming text response
    """
    import time
    from .models import AIConversation, ChatAnalytics

    try:
        # Parse request body
        data = json.loads(request.body) if request.body else {}
    except json.JSONDecodeError:
        return Response(
            {'error': 'Invalid JSON'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user_message = data.get('message', '').strip()

    if not user_message:
        return Response(
            {'error': 'Message is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Get or create session_id
    session_id = data.get('session_id')
    if not session_id:
        import uuid
        session_id = str(uuid.uuid4())

    # Get or create conversation
    conversation, created = AIConversation.objects.get_or_create(
        session_id=session_id,
        defaults={'messages': []}
    )

    # Get conversation history (last 10 messages)
    conversation_history = conversation.messages[-10:] if conversation.messages else []

    # Track start time for analytics
    start_time = time.time()

    def stream_response():
        """Generator function to stream AI responses and collect for analytics"""
        full_response = []
        context_used = {}

        try:
            ai_service = get_ai_service()
            stream_generator, context = ai_service.solo_chat_stream(
                user_message,
                conversation_history,
                inject_context=True
            )

            context_used = context

            for chunk in stream_generator:
                full_response.append(chunk)
                yield chunk

            # After streaming completes, save to conversation and analytics
            final_response = ''.join(full_response)
            response_time_ms = int((time.time() - start_time) * 1000)

            # Save messages to conversation
            conversation.add_message('user', user_message)
            conversation.add_message('assistant', final_response)

            # Save analytics
            ChatAnalytics.objects.create(
                session_id=session_id,
                user_message=user_message,
                ai_response=final_response,
                response_time_ms=response_time_ms,
                context_used=context_used
            )

        except Exception as e:
            error_msg = f"Error: {str(e)}"
            yield error_msg

            # Still try to save error to analytics
            try:
                ChatAnalytics.objects.create(
                    session_id=session_id,
                    user_message=user_message,
                    ai_response=error_msg,
                    response_time_ms=int((time.time() - start_time) * 1000),
                    context_used=context_used
                )
            except:
                pass

    # Return streaming response
    response = StreamingHttpResponse(
        stream_response(),
        content_type='text/plain',
        status=200
    )
    response['Cache-Control'] = 'no-cache'
    response['X-Accel-Buffering'] = 'no'
    response['X-Session-Id'] = session_id  # Send session ID back to client

    return response


@api_view(['POST'])
@permission_classes([IsStaffOrSuperUser])
def blog_ai_assistant(request):
    """
    AI assistant for blog writing (admin only)
    Expects: {
        "prompt": "user's request",
        "context": {
            "title": "blog title" (optional),
            "content": "current content" (optional),
            "excerpt": "current excerpt" (optional)
        } (optional)
    }
    Returns: { "suggestion": "AI-generated suggestion" }
    """
    prompt = request.data.get('prompt', '').strip()

    if not prompt:
        return Response(
            {'error': 'Prompt is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Get context if provided (pass as dict, not string)
    context = request.data.get('context', {})

    try:
        ai_service = get_ai_service()
        suggestion = ai_service.blog_assistant(prompt, context)

        return Response({
            'suggestion': suggestion,
            'prompt': prompt
        })

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def generate_ai_overview(request):
    """
    Generate AI overview for a blog post (public)
    Expects: { "slug": "blog-post-slug" } OR { "title": "...", "content": "..." }
    Returns: { "overview": "AI-generated overview" }
    """
    slug = request.data.get('slug')
    title = request.data.get('title')
    content = request.data.get('content')

    # If slug is provided, fetch the blog post
    if slug:
        try:
            blog_post = BlogPost.objects.get(slug=slug, is_published=True)
            title = blog_post.title
            content = blog_post.content
        except BlogPost.DoesNotExist:
            return Response(
                {'error': 'Blog post not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    # Validate required fields
    if not title or not content:
        return Response(
            {'error': 'Title and content are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        ai_service = get_ai_service()
        overview = ai_service.generate_overview(title, content)

        # If blog post exists, optionally update it
        if slug:
            blog_post.ai_overview = overview
            blog_post.save(update_fields=['ai_overview'])

        return Response({
            'overview': overview,
            'title': title
        })

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ==================== Image Upload View ====================

@api_view(['POST'])
@permission_classes([IsStaffOrSuperUser])
def upload_image(request):
    """
    Upload image to Cloudinary
    Admin only endpoint
    """
    import cloudinary.uploader

    if 'image' not in request.FILES:
        return Response(
            {'error': 'No image file provided'},
            status=status.HTTP_400_BAD_REQUEST
        )

    image_file = request.FILES['image']
    folder = request.data.get('folder', 'lightfield')

    try:
        # Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(
            image_file,
            folder=folder,
            resource_type='image',
            allowed_formats=['jpg', 'jpeg', 'png', 'webp', 'gif']
        )

        return Response({
            'secure_url': upload_result['secure_url'],
            'public_id': upload_result['public_id'],
            'url': upload_result['url'],
            'format': upload_result['format'],
            'width': upload_result['width'],
            'height': upload_result['height']
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ==================== Solo AI Analytics Views ====================

@api_view(['GET'])
@permission_classes([IsStaffOrSuperUser])
def solo_analytics(request):
    """
    Get comprehensive Solo AI chat analytics (admin only)
    Returns: Overview stats and breakdowns
    """
    from .models import ChatAnalytics, AIConversation
    from django.db.models import Avg, Count
    from datetime import timedelta

    # Overall stats
    total_chats = ChatAnalytics.objects.count()
    total_sessions = AIConversation.objects.count()
    avg_response_time = ChatAnalytics.objects.aggregate(avg_time=Avg('response_time_ms'))['avg_time'] or 0

    # Get recent data (last 30 days)
    thirty_days_ago = timezone.now() - timedelta(days=30)
    recent_chats = ChatAnalytics.objects.filter(created_at__gte=thirty_days_ago)

    # Popular topics/questions
    popular_questions = ChatAnalytics.objects.values('user_message').annotate(
        count=Count('id')
    ).order_by('-count')[:10]

    # Context usage breakdown
    context_stats = {
        'blog_posts_used': 0,
        'associates_used': 0,
        'services_used': 0,
    }

    for chat in ChatAnalytics.objects.all():
        if chat.context_used:
            if chat.context_used.get('blog_posts'):
                context_stats['blog_posts_used'] += len(chat.context_used['blog_posts'])
            if chat.context_used.get('associates'):
                context_stats['associates_used'] += len(chat.context_used['associates'])
            if chat.context_used.get('services'):
                context_stats['services_used'] += len(chat.context_used['services'])

    # Engagement stats
    total_with_actions = ChatAnalytics.objects.filter(user_clicked_action=True).count()
    engagement_rate = (total_with_actions / total_chats * 100) if total_chats > 0 else 0

    return Response({
        'overview': {
            'total_chats': total_chats,
            'total_sessions': total_sessions,
            'avg_response_time_ms': round(avg_response_time, 2),
            'recent_chats_30d': recent_chats.count(),
            'engagement_rate': round(engagement_rate, 2),
        },
        'popular_questions': list(popular_questions),
        'context_usage': context_stats,
    })


@api_view(['GET'])
@permission_classes([IsStaffOrSuperUser])
def solo_analytics_trends(request):
    """
    Get Solo AI usage trends over time (admin only)
    Returns: Daily chat volumes, response times, etc.
    """
    from .models import ChatAnalytics
    from django.db.models import Count, Avg
    from django.db.models.functions import TruncDate
    from datetime import timedelta

    # Get date range from query params (default: last 30 days)
    days = int(request.GET.get('days', 30))
    start_date = timezone.now() - timedelta(days=days)

    # Daily chat volumes
    daily_volumes = ChatAnalytics.objects.filter(
        created_at__gte=start_date
    ).annotate(
        date=TruncDate('created_at')
    ).values('date').annotate(
        count=Count('id'),
        avg_response_time=Avg('response_time_ms')
    ).order_by('date')

    # Format for frontend
    trends_data = [
        {
            'date': item['date'].isoformat(),
            'chats': item['count'],
            'avg_response_time': round(item['avg_response_time'], 2) if item['avg_response_time'] else 0,
        }
        for item in daily_volumes
    ]

    return Response({
        'trends': trends_data,
        'period_days': days,
    })
