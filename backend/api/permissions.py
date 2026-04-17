from rest_framework import permissions
from rest_framework.permissions import BasePermission


class IsDonor(permissions.BasePermission):
    """Permission class to check if user is a donor"""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'donor'


class IsNGO(permissions.BasePermission):
    """Permission class to check if user is an NGO"""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'ngo'


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        # user logged in ho aur superuser ho
        return request.user and request.user.is_authenticated and request.user.is_superuser

class IsDonorOrReadOnly(permissions.BasePermission):
    """Allow donors to create, read, update, delete their own donations"""
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_authenticated and request.user.role == 'donor'


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Object-level permission to only allow owners of an object to edit it"""
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner
        if hasattr(obj, 'donor'):
            return obj.donor == request.user
        elif hasattr(obj, 'user'):
            return obj.user == request.user
        return obj == request.user
