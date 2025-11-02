from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins (superusers or staff) to edit objects.
    Read-only permissions are allowed for any request.
    """
    def has_permission(self, request, view):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed for admin users
        return request.user and (request.user.is_staff or request.user.is_superuser)


class IsSuperUserOnly(permissions.BasePermission):
    """
    Permission to only allow superusers to access the view.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser


class IsStaffOrSuperUser(permissions.BasePermission):
    """
    Permission to allow staff or superusers to access the view.
    """
    def has_permission(self, request, view):
        return request.user and (request.user.is_staff or request.user.is_superuser)
