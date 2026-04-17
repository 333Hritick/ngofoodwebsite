from openai import OpenAI
from django.conf import settings
import json


def verify_ngo_ai(organization_name, registration_number):

    client = OpenAI(api_key=settings.OPENAI_API_KEY)

    prompt = f"""
    Verify if this NGO looks real based on name and registration:

    NGO Name: {organization_name}
    Registration Number: {registration_number}

    Reply ONLY in JSON:
    {{
        "is_realistic": true,
        "confidence": 0,
        "reason": ""
    }}
    """

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}],
    )

    content = response.choices[0].message.content

    # ⭐ Convert AI string → python dict
    try:
        result = json.loads(content)
    except Exception:
        result = {
            "is_realistic": False,
            "confidence": 0,
            "reason": "AI response parse failed"
        }

    return result