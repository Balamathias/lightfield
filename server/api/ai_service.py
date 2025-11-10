"""
AI Service for LightField Legal Practitioners
Uses Google Gemini via OpenAI SDK compatibility
"""

from openai import OpenAI
import os
from django.conf import settings


class GeminiAIService:
    """
    Service class for interacting with Google Gemini via OpenAI SDK
    """

    def __init__(self):
        """
        Initialize the Gemini client using OpenAI SDK compatibility
        """
        # Get API key from environment
        api_key = os.getenv('GEMINI_API_KEY')

        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")

        # Initialize OpenAI client pointing to Gemini
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )

        # Default model
        self.model = "gemini-2.0-flash"

    def generate_completion(self, messages, temperature=0.7, max_tokens=2000):
        """
        Generate a completion using Gemini

        Args:
            messages: List of message dicts with 'role' and 'content'
            temperature: Sampling temperature (0-1)
            max_tokens: Maximum tokens to generate

        Returns:
            str: The generated completion
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )

            return response.choices[0].message.content

        except Exception as e:
            raise Exception(f"AI generation failed: {str(e)}")

    def blog_assistant(self, prompt, context=None):
        """
        AI assistant for blog writing

        Args:
            prompt: User's request/question
            context: Optional context (current blog content, title, etc.)

        Returns:
            str: AI-generated suggestion
        """
        system_message = """You are a direct content writer. Your name is Solo; you help create and improve blog content for LightField Legal Practitioners, a law firm specializing in technology, AI, and blockchain law."""

        # Add few-shot examples directly in the conversation
        messages = [
            {"role": "system", "content": system_message},
        ]

        if context:
            messages.append({
                "role": "system",
                "content": f"Blog context: {context}"
            })

        # Add few-shot examples
        messages.extend([
            {"role": "user", "content": "Improve title for SEO"},
            {"role": "assistant", "content": "Blockchain Revolution: How Web3 Transforms Aviation"},
            {"role": "user", "content": "Suggest keywords"},
            {"role": "assistant", "content": "blockchain aviation, web3 technology, decentralized booking, smart contracts, tokenized assets, flight data security"},
            {"role": "user", "content": "Generate meta description"},
            {"role": "assistant", "content": "Explore how blockchain and Web3 are revolutionizing aviation through enhanced security, transparency, and decentralized operations."},
        ])

        messages.append({"role": "user", "content": prompt})

        response = self.generate_completion(messages, temperature=0.3, max_tokens=400)

        # Post-process to clean up common issues
        import re

        # Remove common meta-commentary patterns
        response = re.sub(r'^(Here are?|I suggest|You could|Consider|Option \d+).*?:', '', response, flags=re.IGNORECASE)
        response = re.sub(r'\(.*?\)', '', response)  # Remove parentheses
        response = re.sub(r'\*\*', '', response)  # Remove bold markdown
        response = re.sub(r'\*', '', response)  # Remove asterisks
        response = re.sub(r'^-\s+', '', response, flags=re.MULTILINE)  # Remove bullet points

        # Clean up extra whitespace
        response = re.sub(r'\n{3,}', '\n\n', response)
        response = response.strip()

        return response

    def generate_overview(self, title, content):
        """
        Generate an AI overview/summary for a blog post

        Args:
            title: Blog post title
            content: Blog post content (can be HTML)

        Returns:
            str: AI-generated overview (2-3 sentences)
        """
        # Strip HTML tags for better processing
        import re
        clean_content = re.sub('<[^<]+?>', '', content)

        # Limit content length to avoid token limits
        truncated_content = clean_content[:3000] if len(clean_content) > 3000 else clean_content

        system_message = """You are an expert at creating concise, engaging summaries of legal blog posts.
Create a 2-3 sentence overview that captures the key insights and value of the article.
The overview should be professional, clear, and enticing for readers interested in law and technology."""

        prompt = f"""Title: {title}

Content:
{truncated_content}

Generate a compelling 2-3 sentence overview for this blog post."""

        messages = [
            {"role": "system", "content": system_message},
            {"role": "user", "content": prompt}
        ]

        return self.generate_completion(messages, temperature=0.7, max_tokens=200)

    def solo_chat(self, user_message, conversation_history=None):
        """
        Solo AI assistant - knowledge bank for LightField Legal Practitioners

        Args:
            user_message: User's question
            conversation_history: List of previous messages (optional)

        Returns:
            str: AI assistant's response
        """
        system_message = """You are Solo, the AI legal assistant for LightField Legal Practitioners.
You are a knowledgeable, professional, and helpful assistant that answers questions about:

1. **LightField Legal Practitioners**: A modern law firm specializing in emerging technology, AI, and blockchain law
2. **Practice Areas**: Technology law, AI regulations, blockchain and cryptocurrency law, data privacy, cybersecurity, intellectual property
3. **Legal Information**: General legal concepts and explanations (but always remind users to consult a qualified attorney for specific legal advice)

Key Information about LightField LP:
- Modern law firm focused on cutting-edge technology and digital law
- Expertise in AI, blockchain, cryptocurrency, and Web3 legal frameworks
- Commitment to helping clients navigate the complex intersection of law and technology
- Professional team of experienced attorneys specializing in tech-related legal matters

Guidelines:
- Be professional, clear, and helpful
- Provide accurate information about the firm and general legal concepts
- For specific legal advice, always recommend contacting the firm directly
- If you don't know something about the firm, be honest about it
- Stay focused on legal topics related to technology, AI, and blockchain
- Be concise but thorough in your responses

IMPORTANT: You can only discuss information about LightField Legal Practitioners and general legal concepts.
You do NOT have access to specific blog posts or associate details unless they are explicitly provided in the conversation context."""

        messages = [
            {"role": "system", "content": system_message}
        ]

        # Add conversation history if provided
        if conversation_history:
            messages.extend(conversation_history)

        # Add current user message
        messages.append({"role": "user", "content": user_message})

        return self.generate_completion(messages, temperature=0.8, max_tokens=1500)


# Singleton instance
_ai_service = None

def get_ai_service():
    """
    Get or create the AI service instance
    """
    global _ai_service
    if _ai_service is None:
        _ai_service = GeminiAIService()
    return _ai_service
