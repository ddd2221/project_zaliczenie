from rest_framework import permissions


class IsOrganizerOrReadOnly(permissions.BasePermission):
    """Read access for everyone; write access only for the event organizer or staff."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.organizer_id == request.user.id or request.user.is_staff
