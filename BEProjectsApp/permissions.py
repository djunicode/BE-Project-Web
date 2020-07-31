from rest_framework import permissions


class IsUserOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS or request.user


class Permit(permissions.BasePermission):
    message: "Not allowed To Access"

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True
        else:
            return False

    # def has_object_permission(self, request, view, obj):
    #     return obj.user == request.user
