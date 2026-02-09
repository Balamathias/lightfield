import logging
from django.conf import settings
from django.core.mail import send_mail
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)


def send_booking_confirmation(booking):
    """
    Send HTML confirmation email to client after successful payment.
    """
    subject = f'Booking Confirmed - {booking.reference} | LightField Legal'

    service_name = booking.service_name
    formatted_date = booking.preferred_date.strftime('%B %d, %Y')
    formatted_time = booking.preferred_time.strftime('%I:%M %p')

    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }}
            .container {{ max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }}
            .header {{ background: linear-gradient(135deg, #b87333, #d4a76a); padding: 40px 30px; text-align: center; }}
            .header h1 {{ color: #fff; margin: 0; font-size: 24px; font-weight: 600; }}
            .header p {{ color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px; }}
            .body {{ padding: 30px; }}
            .reference {{ background: #f8f4ef; border: 2px dashed #b87333; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0; }}
            .reference .label {{ font-size: 12px; text-transform: uppercase; color: #888; letter-spacing: 1px; }}
            .reference .value {{ font-size: 24px; font-weight: 700; color: #b87333; margin-top: 4px; }}
            .details {{ background: #fafafa; border-radius: 8px; padding: 20px; margin: 20px 0; }}
            .details .row {{ display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }}
            .details .row:last-child {{ border-bottom: none; }}
            .details .label {{ color: #888; font-size: 14px; }}
            .details .value {{ font-weight: 600; font-size: 14px; }}
            .footer {{ padding: 20px 30px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Booking Confirmed</h1>
                <p>Thank you for choosing LightField Legal Practitioners</p>
            </div>
            <div class="body">
                <p>Dear {booking.client_name},</p>
                <p>Your consultation booking has been received and payment confirmed. Our team will review your booking and confirm your appointment shortly.</p>

                <div class="reference">
                    <div class="label">Booking Reference</div>
                    <div class="value">{booking.reference}</div>
                </div>

                <div class="details">
                    <div class="row">
                        <span class="label">Service</span>
                        <span class="value">{service_name}</span>
                    </div>
                    <div class="row">
                        <span class="label">Date</span>
                        <span class="value">{formatted_date}</span>
                    </div>
                    <div class="row">
                        <span class="label">Time</span>
                        <span class="value">{formatted_time}</span>
                    </div>
                    <div class="row">
                        <span class="label">Amount Paid</span>
                        <span class="value">{booking.formatted_amount}</span>
                    </div>
                </div>

                <p>Please save this reference number for your records. We'll confirm your appointment via email.</p>
                <p>If you have any questions, don't hesitate to reach out to us.</p>
                <p>Best regards,<br><strong>LightField Legal Practitioners</strong></p>
            </div>
            <div class="footer">
                &copy; LightField Legal Practitioners. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    """

    plain_message = strip_tags(html_message)

    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[booking.client_email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f'Booking confirmation email sent to {booking.client_email} for {booking.reference}')
    except Exception as e:
        logger.error(f'Failed to send booking confirmation email for {booking.reference}: {e}')


def send_admin_booking_notification(booking):
    """
    Send notification email to admin about a new paid booking.
    """
    subject = f'New Paid Booking - {booking.reference} | {booking.service_name}'

    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 30px; }}
            h2 {{ color: #b87333; }}
            .details {{ background: #f8f4ef; border-radius: 8px; padding: 16px; margin: 16px 0; }}
            .row {{ padding: 6px 0; }}
            .label {{ color: #888; font-size: 13px; }}
            .value {{ font-weight: 600; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h2>New Booking Received</h2>
            <p>A new consultation booking has been paid and is awaiting confirmation.</p>
            <div class="details">
                <div class="row"><span class="label">Reference:</span> <span class="value">{booking.reference}</span></div>
                <div class="row"><span class="label">Client:</span> <span class="value">{booking.client_name}</span></div>
                <div class="row"><span class="label">Email:</span> <span class="value">{booking.client_email}</span></div>
                <div class="row"><span class="label">Phone:</span> <span class="value">{booking.client_phone}</span></div>
                <div class="row"><span class="label">Service:</span> <span class="value">{booking.service_name}</span></div>
                <div class="row"><span class="label">Date:</span> <span class="value">{booking.preferred_date}</span></div>
                <div class="row"><span class="label">Time:</span> <span class="value">{booking.preferred_time}</span></div>
                <div class="row"><span class="label">Amount:</span> <span class="value">{booking.formatted_amount}</span></div>
            </div>
            <p>Log in to the admin panel to confirm or manage this booking.</p>
        </div>
    </body>
    </html>
    """

    plain_message = strip_tags(html_message)
    admin_email = settings.DEFAULT_FROM_EMAIL

    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[admin_email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f'Admin notification sent for booking {booking.reference}')
    except Exception as e:
        logger.error(f'Failed to send admin notification for {booking.reference}: {e}')
