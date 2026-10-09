from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .serializers import (
    UserRegistrationSerializer,
    UserProfileSerializer,
    CustomTokenObtainPairSerializer,
)

User = get_user_model()


@extend_schema(
    summary="User Registration",
    description="Registers a new user profile with secure PBKDF2 password hashing.",
    responses={
        201: UserProfileSerializer,
        400: OpenApiResponse(description="Validation error (passwords mismatch, duplicate email, etc.)")
    }
)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        profile_serializer = UserProfileSerializer(user)
        return Response(
            {
                "message": "User registered successfully.",
                "user": profile_serializer.data,
            },
            status=status.HTTP_201_CREATED
        )


@extend_schema(
    summary="Obtain JWT Pair",
    description="Authenticate with username & password to receive access and sliding refresh tokens."
)
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@extend_schema(
    summary="Current User Profile",
    description="Retrieve currently authenticated user identity from Bearer JWT."
)
class ProfileView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user
