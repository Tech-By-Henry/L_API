from django.urls import path
from .views import RegisterView, LoginView, LogoutView, get_bank_list
from .import views

urlpatterns = [
    path('api/signup/', RegisterView.as_view(), name='signup'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path("verify-account/", views.verify_account, name="verify_account"),
    path('get-bank-list/', get_bank_list, name='get_bank_list'),
    path('save-account/', views.save_account, name='save-account'),
    path('accounts/', views.get_saved_accounts, name='get-saved-accounts'),
]
