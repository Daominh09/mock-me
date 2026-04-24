from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import requests

User = get_user_model()

GOOGLE_TOKENINFO_URL = 'https://oauth2.googleapis.com/tokeninfo'


class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        access_token = request.data.get('access_token')
        if not access_token:
            return Response({'detail': 'access_token is required'}, status=status.HTTP_400_BAD_REQUEST)

        resp = requests.get(GOOGLE_TOKENINFO_URL, params={'access_token': access_token}, timeout=5)
        if resp.status_code != 200:
            return Response({'detail': 'Invalid access token'}, status=status.HTTP_400_BAD_REQUEST)

        info = resp.json()

        if info.get('aud') != settings.GOOGLE_CLIENT_ID:
            return Response({'detail': 'Token audience mismatch'}, status=status.HTTP_400_BAD_REQUEST)

        email = info.get('email')
        if not email:
            return Response({'detail': 'No email in token'}, status=status.HTTP_400_BAD_REQUEST)

        user, _ = User.objects.get_or_create(
            email=email,
            defaults={'username': email.split('@')[0]},
        )

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
        })
