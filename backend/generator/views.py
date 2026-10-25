"""
DRF API View — Brochure Generation Endpoint.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import BrochureRequestSerializer
from .services import fetch_website, summarize_website, generate_brochure


class GenerateBrochureView(APIView):
    """
    POST /api/generate-brochure/
    
    Request Body:
    {
        "company_name": "Tesla",
        "website_url": "https://tesla.com"
    }
    
    Success Response (200):
    {
        "success": true,
        "company_name": "Tesla",
        "summary": "...",
        "html_brochure": "<html>...</html>"
    }
    
    Error Response (400/500):
    {
        "success": false,
        "error": "Error message here"
    }
    """

    def post(self, request):
        # --- Step 1: Validate input with Serializer ---
        serializer = BrochureRequestSerializer(data=request.data)

        if not serializer.is_valid():
            # DRF automatically detailed errors deta hai
            return Response(
                {
                    "success": False,
                    "error": "Invalid input.",
                    "details": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validated data extract karo
        company_name = serializer.validated_data["company_name"]
        website_url = serializer.validated_data["website_url"]

        # --- Step 2: AI Processing ---
        try:
            website_text = fetch_website(website_url)
            summary = summarize_website(company_name, website_text)
            html_brochure = generate_brochure(
                company_name, website_url, summary
            )

            return Response(
                {
                    "success": True,
                    "company_name": company_name,
                    "summary": summary,
                    "html_brochure": html_brochure,
                },
                status=status.HTTP_200_OK,
            )

        except ValueError as e:
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            return Response(
                {
                    "success": False,
                    "error": f"Server error: {type(e).__name__}",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )