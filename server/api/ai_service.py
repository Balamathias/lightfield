"""
AI Service for LightField Legal Practitioners
Uses Google Gemini via OpenAI SDK compatibility
"""

from openai import OpenAI
import os
from django.conf import settings
from django.db.models import Q
import re


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

    def retrieve_relevant_context(self, user_message):
        """
        Retrieve relevant context from database based on user message

        Args:
            user_message: User's question

        Returns:
            dict: Context containing blog_posts, associates, services
        """
        from .models import BlogPost, Associate

        context = {
            'blog_posts': [],
            'associates': [],
            'services': []
        }

        # Extract keywords from user message
        keywords = self._extract_keywords(user_message.lower())

        # Search for relevant blog posts
        if keywords:
            query = Q()
            for keyword in keywords:
                query |= Q(title__icontains=keyword) | Q(content__icontains=keyword) | Q(excerpt__icontains=keyword)

            blog_posts = BlogPost.objects.filter(
                query,
                is_published=True
            ).order_by('-created_at')[:3]

            context['blog_posts'] = [
                {
                    'id': post.id,
                    'title': post.title,
                    'excerpt': post.excerpt,
                    'slug': post.slug,
                }
                for post in blog_posts
            ]

        # Search for relevant associates
        associate_query = Q(is_active=True)
        for keyword in keywords:
            associate_query &= (
                Q(name__icontains=keyword) |
                Q(bio__icontains=keyword) |
                Q(title__icontains=keyword)
            )

        associates = Associate.objects.filter(associate_query)[:2]

        context['associates'] = [
            {
                'id': assoc.id,
                'name': assoc.name,
                'title': assoc.title,
                'expertise': assoc.expertise,
                'slug': assoc.slug,
                'bio': assoc.bio,
            }
            for assoc in associates
        ]

        # Identify relevant practice areas/services
        practice_areas = {
            'artificial intelligence': ['ai', 'artificial intelligence', 'machine learning', 'neural network', 'algorithm'],
            'blockchain': ['blockchain', 'cryptocurrency', 'bitcoin', 'ethereum', 'crypto', 'defi', 'nft', 'web3', 'smart contract'],
            'intellectual property': ['ip', 'intellectual property', 'patent', 'trademark', 'copyright', 'trade secret'],
            'regulatory compliance': ['compliance', 'regulation', 'regulatory', 'sec', 'finra', 'gdpr'],
            'corporate law': ['corporate', 'company', 'startup', 'm&a', 'merger', 'acquisition', 'fundraising'],
            'data privacy': ['privacy', 'data protection', 'gdpr', 'ccpa', 'personal data'],
        }

        for area, area_keywords in practice_areas.items():
            if any(keyword in user_message.lower() for keyword in area_keywords):
                context['services'].append(area)

        return context

    def _extract_keywords(self, text):
        """
        Extract meaningful keywords from text
        """
        # Remove common stop words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
                     'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
                     'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
                     'can', 'could', 'may', 'might', 'what', 'which', 'who', 'when', 'where',
                     'why', 'how', 'i', 'you', 'me', 'my', 'your', 'tell', 'about', 'need', 'want'}

        # Extract words
        words = re.findall(r'\b[a-z]{3,}\b', text)

        # Filter stop words and return unique keywords
        keywords = [word for word in words if word not in stop_words]
        return list(set(keywords))[:10]  # Limit to 10 keywords

    def _format_context_for_prompt(self, context):
        """
        Format retrieved context into a string for the AI prompt
        """
        parts = []

        if context['blog_posts']:
            parts.append("=== RELEVANT BLOG POSTS ===")
            for post in context['blog_posts']:
                parts.append(f"Title: {post['title']}")
                parts.append(f"Excerpt: {post['excerpt']}")
                parts.append(f"URL: /blog/{post['slug']}")
                parts.append("")

        if context['associates']:
            parts.append("=== RELEVANT TEAM MEMBERS ===")
            for assoc in context['associates']:
                parts.append(f"Name: {assoc['name']}")
                parts.append(f"Title: {assoc['title']}")
                parts.append(f"Expertise: {', '.join(assoc['expertise'])}")
                parts.append(f"Bio: {assoc['bio']}")
                parts.append(f"Profile: /team/{assoc['slug']}")
                parts.append("")

        if context['services']:
            parts.append("=== RELEVANT PRACTICE AREAS ===")
            parts.append(", ".join([s.title() for s in context['services']]))
            parts.append("")

        return "\n".join(parts) if parts else None

    def solo_chat_stream(self, user_message, conversation_history=None, inject_context=True):
        """
        Solo AI assistant with streaming support

        Args:
            user_message: User's question
            conversation_history: List of previous messages (optional)
            inject_context: Whether to inject relevant context from database

        Returns:
            tuple: (generator of chunks, context dict)
        """
        # Retrieve relevant context if enabled
        context = {}
        context_text = None

        if inject_context:
            context = self.retrieve_relevant_context(user_message)
            context_text = self._format_context_for_prompt(context)

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
- When relevant context is provided below, reference specific blog posts, team members, or services
- Include clickable links in your responses using markdown format: [Link Text](URL)
- For blog posts, use format: [Read more: Article Title](/blog/slug)
- For team profiles, use format: [Meet Name](/team/slug)
- For specific legal advice, always recommend contacting the firm directly
- Use markdown formatting: **bold** for emphasis, bullet points for lists
- Stay focused on legal topics related to technology, AI, and blockchain
- Be concise but thorough in your responses"""

        # Add context if available
        if context_text:
            system_message += f"\n\n{context_text}\n\nIMPORTANT: Reference the above information when relevant to the user's question."

        messages = [
            {"role": "system", "content": system_message}
        ]

        # Add conversation history if provided
        if conversation_history:
            messages.extend(conversation_history)

        # Add current user message
        messages.append({"role": "user", "content": user_message})

        def generate_stream():
            """Inner generator function"""
            try:
                # Create streaming completion
                stream = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=0.8,
                    max_tokens=1500,
                    stream=True
                )

                # Yield chunks as they arrive
                for chunk in stream:
                    if chunk.choices[0].delta.content is not None:
                        yield chunk.choices[0].delta.content

            except Exception as e:
                yield f"Error: {str(e)}"

        return generate_stream(), context


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
