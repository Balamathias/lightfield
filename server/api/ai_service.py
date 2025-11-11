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
        Enhanced AI assistant for blog writing with specialized capabilities

        Args:
            prompt: User's request/question
            context: Optional context (current blog content, title, etc.)

        Returns:
            str: AI-generated suggestion with markdown formatting
        """
        # Determine the type of request for specialized handling
        prompt_lower = prompt.lower()

        # Build context intelligently
        has_title = context and context.get('title')
        has_content = context and context.get('content') and len(context.get('content', '')) > 50
        has_excerpt = context and context.get('excerpt')

        # Specialized system messages based on request type
        if any(word in prompt_lower for word in ['title', 'headline', 'heading']):
            system_message = """You are an expert SEO copywriter for LightField Legal Practitioners, a law firm specializing in AI and blockchain law.

CRITICAL INSTRUCTIONS:
- Output ONLY the optimized title, nothing else
- No explanations, no options, no questions
- Be decisive and direct
- Make it compelling and SEO-friendly
- 50-70 characters optimal
- Professional legal tone for emerging tech topics

If you have content context, base the title on that. If not, create a compelling title about legal tech topics."""

        elif any(word in prompt_lower for word in ['excerpt', 'summary']):
            system_message = """You are a content strategist for LightField Legal Practitioners, a tech law firm.

CRITICAL INSTRUCTIONS:
- Output ONLY the excerpt, nothing else
- No questions, no options, no meta-commentary
- Be decisive - just write it
- 60-120 words optimal
- Hook the reader immediately with value
- Professional yet engaging tone
- End with intrigue or subtle call-to-action

If you have title/content context, summarize it. If not, create an excerpt about a relevant legal tech topic."""

        elif any(word in prompt_lower for word in ['meta description', 'seo description']):
            system_message = """You are an SEO specialist for a premium tech law firm.

CRITICAL INSTRUCTIONS:
- Output ONLY the meta description, nothing else
- Exactly 150-155 characters
- No questions, no explanations
- Include relevant keywords naturally
- Make it compelling and action-oriented
- Professional tone

If you have context, use it. If not, create one about tech law services."""

        elif any(word in prompt_lower for word in ['keyword', 'seo keyword']):
            system_message = """You are an SEO keyword specialist for legal tech content.

CRITICAL INSTRUCTIONS:
- Output ONLY comma-separated keywords
- No explanations, no categories, no formatting except commas
- 8-12 keywords total
- Mix of short-tail and long-tail keywords
- Include: legal terms, tech terms, industry terms
- Relevant to blockchain, AI, or tech law

Example format: blockchain law, smart contract regulation, cryptocurrency compliance, AI legal frameworks"""

        elif any(word in prompt_lower for word in ['introduction', 'intro', 'opening']):
            system_message = """You are a legal content writer for LightField Legal Practitioners.

CRITICAL INSTRUCTIONS:
- Output ONLY the introduction paragraphs
- No meta-commentary, just write it
- 2-3 compelling paragraphs
- Hook with relevant question, statistic, or insight
- Preview what article covers
- Professional but engaging
- Use **bold** for key terms
- If you have context, reference it. If not, write about a relevant tech law topic."""

        elif any(word in prompt_lower for word in ['outline', 'structure', 'key points', 'points to cover']):
            system_message = """You are a content strategist for legal blog posts.

CRITICAL INSTRUCTIONS:
- Output ONLY the structured outline using markdown
- No questions, no options
- Format: ## Main Section, ### Subsection, - bullet points
- 4-6 main sections
- Professional legal content structure
- Each section should have 2-4 key points

If you have context, create outline based on it. If not, create outline for a tech law topic."""

        else:
            # General blog writing assistant
            system_message = """You are Solo, an expert legal content writer for LightField Legal Practitioners, a law firm specializing in AI, blockchain, and emerging technology law.

CRITICAL INSTRUCTIONS:
- Output ONLY the requested content
- NO meta-commentary, NO questions, NO "here's a suggestion"
- Be decisive and direct
- Professional, authoritative yet accessible
- Use markdown formatting (**bold**, lists, etc.)
- Focus on practical insights and real-world implications

If you have context, use it intelligently. If not, generate high-quality content about tech law topics."""

        messages = [
            {"role": "system", "content": system_message},
        ]

        # Add context if provided - be more specific about what's available
        if context:
            context_parts = []

            if has_title:
                context_parts.append(f"Blog Title: {context['title']}")

            if has_excerpt:
                context_parts.append(f"Excerpt: {context['excerpt']}")

            if has_content:
                # Limit content to avoid token limits
                content_preview = context['content'][:1500]
                context_parts.append(f"Content: {content_preview}")

            if context_parts:
                context_message = "USE THIS CONTEXT TO GENERATE YOUR RESPONSE:\n\n" + "\n\n".join(context_parts)
                context_message += "\n\nIMPORTANT: Generate content directly based on this context. Do NOT ask for more information."

                messages.append({
                    "role": "system",
                    "content": context_message
                })
            else:
                # No meaningful context provided
                messages.append({
                    "role": "system",
                    "content": "No context provided. Generate high-quality content about AI law, blockchain law, or technology law topics. Be specific and professional."
                })

        # Add few-shot example to reinforce direct responses
        messages.extend([
            {"role": "user", "content": "Generate compelling excerpt"},
            {"role": "assistant", "content": "Discover how artificial intelligence is reshaping legal compliance in 2025. From automated contract review to predictive risk analysis, AI technologies are revolutionizing how law firms serve clients. Learn the key implications, regulatory challenges, and opportunities that every business leader needs to understand in this rapidly evolving landscape."},
        ])

        # Add user prompt
        messages.append({"role": "user", "content": prompt})

        # Generate with appropriate temperature based on task
        if any(word in prompt_lower for word in ['creative', 'headline', 'title']):
            temperature = 0.7  # Balanced creativity for titles
        elif any(word in prompt_lower for word in ['seo', 'keyword', 'meta']):
            temperature = 0.4  # More focused for SEO
        else:
            temperature = 0.6  # Conservative for general content

        response = self.generate_completion(messages, temperature=temperature, max_tokens=500)

        # Aggressive post-processing to remove ALL meta-commentary
        # Remove questions
        response = re.sub(r'^.*\?.*$', '', response, flags=re.MULTILINE)

        # Remove lines with "I need", "Tell me", "Give me", "Let me know", etc.
        response = re.sub(r'^.*?(I need|Tell me|Give me|Let me know|Please provide|Could you|Can you|Would you).*$', '', response, flags=re.MULTILINE | re.IGNORECASE)

        # Remove option headers
        response = re.sub(r'\*\*Option \d+.*?\*\*', '', response, flags=re.IGNORECASE)
        response = re.sub(r'^Option \d+.*?:', '', response, flags=re.MULTILINE | re.IGNORECASE)

        # Remove "Here's", "Here are" at start
        response = re.sub(r'^(Here\'s?|Here are?|I suggest|You could|Consider|Meanwhile|In the meantime).*?:\s*', '', response, flags=re.IGNORECASE | re.MULTILINE)

        # Remove lines that are instructions or questions
        response = re.sub(r'^.*?(once I have|give me the|tell me about|what is the).*$', '', response, flags=re.MULTILINE | re.IGNORECASE)

        # Remove blockquote markers for inline content
        if any(word in prompt_lower for word in ['title', 'keyword', 'meta']):
            response = re.sub(r'^>\s*', '', response, flags=re.MULTILINE)

        # Remove asterisks for titles and keywords (keep for content)
        if any(word in prompt_lower for word in ['title', 'keyword', 'meta description']):
            response = re.sub(r'\*', '', response)

        # Clean up excessive whitespace
        response = re.sub(r'\n{3,}', '\n\n', response)

        # Remove empty lines at start and end
        lines = [line for line in response.split('\n') if line.strip()]
        response = '\n'.join(lines)

        response = response.strip()

        # If response is still empty or has questions, provide default
        if not response or '?' in response[:50]:
            if 'title' in prompt_lower:
                response = "Navigating AI and Blockchain Law: Expert Legal Guidance for Emerging Technologies"
            elif 'excerpt' in prompt_lower:
                response = "Explore the intersection of law and cutting-edge technology. LightField Legal Practitioners provides specialized counsel in AI regulation, blockchain compliance, and digital asset law. Discover how expert legal guidance can protect your innovation."
            elif 'keyword' in prompt_lower:
                response = "AI law, blockchain legal services, cryptocurrency regulation, smart contract law, technology compliance, digital asset law, Web3 legal counsel, emerging tech law"
            elif 'meta' in prompt_lower:
                response = "Expert legal counsel for AI, blockchain, and emerging technologies. LightField Legal Practitioners delivers specialized guidance for tech innovation."

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
