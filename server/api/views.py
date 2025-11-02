from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Q, Count, Sum
from django.utils import timezone
from django.shortcuts import get_object_or_404

from .models import Associate, BlogCategory, BlogPost, AIConversation, ContactSubmission, User
from .serializers import (
    AssociateListSerializer, AssociateDetailSerializer, AssociateWriteSerializer,
    BlogCategorySerializer, BlogCategoryWriteSerializer,
    BlogPostListSerializer, BlogPostDetailSerializer, BlogPostWriteSerializer,
    AIConversationSerializer, AIMessageSerializer,
    ContactSubmissionSerializer, ContactSubmissionListSerializer,
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

        serializer = BlogPostListSerializer(queryset, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = BlogPostWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        serializer = BlogPostWriteSerializer(blog, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
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
        'total_views': BlogPost.objects.aggregate(Sum('view_count'))['view_count__sum'] or 0
    }

    serializer = DashboardStatsSerializer(stats)
    return Response(serializer.data)


# ==================== AI Features Views ====================
# These will be implemented in Phase 6
# Placeholder views for now

@api_view(['POST'])
@permission_classes([AllowAny])
def solo_chat(request):
    """
    Solo AI assistant chat endpoint (public)
    Will be implemented with OpenAI integration
    """
    return Response({'message': 'Solo AI chat endpoint - coming soon'})


@api_view(['POST'])
@permission_classes([IsStaffOrSuperUser])
def blog_ai_assistant(request):
    """
    AI assistant for blog writing (admin only)
    Will be implemented with OpenAI integration
    """
    return Response({'message': 'Blog AI assistant endpoint - coming soon'})


@api_view(['POST'])
@permission_classes([AllowAny])
def generate_ai_overview(request):
    """
    Generate AI overview for a blog post (public)
    Will be implemented with OpenAI integration
    """
    return Response({'message': 'AI overview generation endpoint - coming soon'})
