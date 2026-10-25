"""
Input validation — DRF Serializer.
Ye check karta hai ke request mein sahi data aaya hai ya nahi.
"""

from rest_framework import serializers
import re


class BrochureRequestSerializer(serializers.Serializer):
    """
    User se ye 2 fields chahiye:
    - company_name: string, zaroori, max 200 characters
    - website_url: valid URL, zaroori
    """

    company_name = serializers.CharField(
        max_length=200,
        required=True,
        error_messages={
            "blank": "Company name khali nahi ho sakta.",
            "max_length": "Company name 200 characters se zyada nahi ho sakta.",
        },
    )

    website_url = serializers.URLField(
        required=True,
        error_messages={
            "blank": "Website URL khali nahi ho sakta.",
            "invalid": "Valid URL daalo (e.g., https://example.com).",
        },
    )

    def validate_company_name(self, value):
        """Extra validation: sirf spaces ka naam reject karo."""
        if not value.strip():
            raise serializers.ValidationError(
                "Company name sirf spaces nahi ho sakta."
            )
        return value.strip()

    def validate_website_url(self, value):
        """URL ko https:// ensure karo."""
        if not re.match(r"^https?://", value, flags=re.IGNORECASE):
            value = "https://" + value
        return value.strip()