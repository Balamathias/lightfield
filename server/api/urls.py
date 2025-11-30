from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'api'

urlpatterns = [
    # Authentication
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Associates
    path('associates/', views.associates_list_create, name='associates-list-create'),
    path('associates/reorder/', views.reorder_associates, name='reorder-associates'),
    path('associates/<slug:slug>/', views.associate_detail, name='associate-detail'),

    # Blog Categories
    path('categories/', views.categories_list_create, name='categories-list-create'),
    path('categories/reorder/', views.reorder_categories, name='reorder-categories'),
    path('categories/<int:pk>/', views.category_detail, name='category-detail'),

    # Blog Posts
    path('blogs/', views.blogs_list_create, name='blogs-list-create'),
    path('blogs/reorder/', views.reorder_blogs, name='reorder-blogs'),
    path('blogs/ai-assist/', views.blog_ai_assistant, name='blog-ai-assistant'),
    path('blogs/ai-overview/', views.generate_ai_overview, name='generate-ai-overview'),
    path('blogs/<slug:slug>/', views.blog_detail, name='blog-detail'),

    # AI Features
    path('solo/chat/', views.solo_chat, name='solo-chat'),
    path('solo/analytics/', views.solo_analytics, name='solo-analytics'),
    path('solo/analytics/trends/', views.solo_analytics_trends, name='solo-analytics-trends'),

    # Contact
    path('contact/submit/', views.submit_contact, name='submit-contact'),
    path('contact/list/', views.list_contacts, name='list-contacts'),
    path('contact/<int:pk>/', views.contact_detail, name='contact-detail'),

    # Testimonials
    path('testimonials/', views.testimonials_list_create, name='testimonials-list-create'),
    path('testimonials/reorder/', views.reorder_testimonials, name='reorder-testimonials'),
    path('testimonials/<int:pk>/', views.testimonial_detail, name='testimonial-detail'),

    # Grants & Scholarships
    path('grants/', views.grants_list_create, name='grants-list-create'),
    path('grants/reorder/', views.reorder_grants, name='reorder-grants'),
    path('grants/featured/', views.featured_grants, name='featured-grants'),
    path('grants/open/', views.open_grants, name='open-grants'),
    path('grants/<slug:slug>/', views.grant_detail, name='grant-detail'),

    # Admin Dashboard
    path('admin/stats/', views.dashboard_stats, name='dashboard-stats'),
    path('admin/charts/blog-views/', views.blog_views_over_time, name='blog-views-chart'),
    path('admin/charts/posts-timeline/', views.posts_over_time, name='posts-timeline-chart'),
    path('admin/charts/posts-by-category/', views.posts_by_category, name='posts-by-category-chart'),
    path('admin/charts/contacts-by-status/', views.contacts_by_status, name='contacts-by-status-chart'),

    # Image Upload
    path('upload-image/', views.upload_image, name='upload-image'),
]
