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
    path('associates/<slug:slug>/', views.associate_detail, name='associate-detail'),
    path('associates/reorder/', views.reorder_associates, name='reorder-associates'),

    # Blog Categories
    path('categories/', views.categories_list_create, name='categories-list-create'),
    path('categories/<int:pk>/', views.category_detail, name='category-detail'),

    # Blog Posts
    path('blogs/', views.blogs_list_create, name='blogs-list-create'),
    path('blogs/<slug:slug>/', views.blog_detail, name='blog-detail'),
    path('blogs/reorder/', views.reorder_blogs, name='reorder-blogs'),

    # AI Features
    path('blogs/ai-assist/', views.blog_ai_assistant, name='blog-ai-assistant'),
    path('blogs/ai-overview/', views.generate_ai_overview, name='generate-ai-overview'),
    path('solo/chat/', views.solo_chat, name='solo-chat'),

    # Contact
    path('contact/submit/', views.submit_contact, name='submit-contact'),
    path('contact/list/', views.list_contacts, name='list-contacts'),
    path('contact/<int:pk>/', views.contact_detail, name='contact-detail'),

    # Admin Dashboard
    path('admin/stats/', views.dashboard_stats, name='dashboard-stats'),
]
