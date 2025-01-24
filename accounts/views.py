from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "email": user.email,
            "refresh_token": str(refresh),
            "access_token": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=email, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "email": user.email,
                "refresh_token": str(refresh),
                "access_token": str(refresh.access_token),
            })
        else:
            return Response({"error": "Invalid email or password"}, status=400)
        


class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Get the refresh token from the request
            refresh_token = request.data.get('refresh_token')

            # Create a RefreshToken instance
            token = RefreshToken(refresh_token)

            # Blacklist the token
            token.blacklist()

            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import requests
import json

# Your Bearer Token (replace with the actual token)
API_BEARER_TOKEN = "eeReZfl2NmJDFWhpqJnFznzR1BKBRkPls7KBTERc5035a45f"

@csrf_exempt
def verify_account(request):
    if request.method == "POST":
        try:
            # Parse JSON from the request body
            data = json.loads(request.body)
            account_number = data.get("account_number")
            bank_code = data.get("bank_code")

            if not account_number or not bank_code:
                return JsonResponse({"error": "Account number and bank code are required."}, status=400)

            # NUB API request
            headers = {
                "Authorization": f"Bearer {API_BEARER_TOKEN}",
            }
            params = {
                "account_number": account_number,
                "bank_code": bank_code,
            }
            response = requests.get("https://nubapi.com/api/verify", headers=headers, params=params)
            
            # Check if NUB API returned success
            if response.status_code == 200:
                return JsonResponse(response.json(), status=200)
            else:
                return JsonResponse({"error": "Failed to verify account details."}, status=response.status_code)

        except requests.exceptions.RequestException as e:
            return JsonResponse({"error": f"External API error: {str(e)}"}, status=500)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format in request."}, status=400)
    return JsonResponse({"error": "Invalid request method."}, status=405)

import requests
from django.http import JsonResponse

def get_bank_list(request):
    try:
        # Fetch the bank list from the external API
        response = requests.get('https://nubapi.com/bank-json')
        
        # Check if the response was successful
        if response.status_code == 200:
            bank_list = response.json()  # Parse the JSON response
            return JsonResponse(bank_list, safe=False)  # Return the list as JSON
        else:
            return JsonResponse({'error': 'Failed to fetch bank data'}, status=500)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Account
from .serializers import AccountSerializer

@api_view(['POST'])
def save_account(request):
    if request.method == 'POST':
        data = request.data
        serializer = AccountSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Account saved successfully!', 'data': serializer.data}, status=201)
        return Response({'error': 'Failed to save account'}, status=400)


# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Account
from .serializers import AccountSerializer

@api_view(['GET'])
def get_saved_accounts(request):
    accounts = Account.objects.all()  # Get all accounts
    serializer = AccountSerializer(accounts, many=True)
    return Response(serializer.data)  # Return serialized account data
