import hashlib
import hmac
import requests
from django.conf import settings


def initialize_transaction(email, amount_kobo, reference, metadata=None):
    """
    Initialize a Paystack transaction.
    Returns dict with authorization_url, access_code, reference on success.
    """
    url = 'https://api.paystack.co/transaction/initialize'
    headers = {
        'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}',
        'Content-Type': 'application/json',
    }
    payload = {
        'email': email,
        'amount': int(amount_kobo),
        'reference': reference,
        'callback_url': settings.PAYSTACK_CALLBACK_URL,
    }
    if metadata:
        payload['metadata'] = metadata

    response = requests.post(url, json=payload, headers=headers, timeout=30)
    data = response.json()

    if not data.get('status'):
        raise Exception(data.get('message', 'Failed to initialize Paystack transaction'))

    return data['data']


def verify_transaction(reference):
    """
    Verify a Paystack transaction by reference.
    Returns transaction data dict on success.
    """
    url = f'https://api.paystack.co/transaction/verify/{reference}'
    headers = {
        'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}',
    }

    response = requests.get(url, headers=headers, timeout=30)
    data = response.json()

    if not data.get('status'):
        raise Exception(data.get('message', 'Failed to verify Paystack transaction'))

    return data['data']


def validate_webhook_signature(payload_body, signature):
    """
    Validate Paystack webhook HMAC SHA512 signature.
    Returns True if valid.
    """
    if not signature or not settings.PAYSTACK_SECRET_KEY:
        return False

    expected = hmac.new(
        settings.PAYSTACK_SECRET_KEY.encode('utf-8'),
        payload_body,
        hashlib.sha512,
    ).hexdigest()

    return hmac.compare_digest(expected, signature)
