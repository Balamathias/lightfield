from django.core.management.base import BaseCommand
from api.models import BlogPost
from api.ai_service import get_ai_service


class Command(BaseCommand):
    help = 'Generate AI overviews for blog posts that don\'t have them'

    def add_arguments(self, parser):
        parser.add_argument(
            '--regenerate',
            action='store_true',
            help='Regenerate AI overviews for all posts, even those that already have them',
        )
        parser.add_argument(
            '--slug',
            type=str,
            help='Generate AI overview for a specific blog post by slug',
        )

    def handle(self, *args, **options):
        regenerate = options['regenerate']
        slug = options.get('slug')

        ai_service = get_ai_service()

        # Get blogs to process
        if slug:
            blogs = BlogPost.objects.filter(slug=slug)
            if not blogs.exists():
                self.stdout.write(self.style.ERROR(f'Blog post with slug "{slug}" not found'))
                return
        elif regenerate:
            blogs = BlogPost.objects.all()
            self.stdout.write(self.style.WARNING('Regenerating AI overviews for ALL blog posts...'))
        else:
            blogs = BlogPost.objects.filter(ai_overview__isnull=True) | BlogPost.objects.filter(ai_overview='')
            self.stdout.write(self.style.SUCCESS(f'Found {blogs.count()} blog posts without AI overviews'))

        if not blogs.exists():
            self.stdout.write(self.style.SUCCESS('No blog posts need AI overview generation'))
            return

        success_count = 0
        error_count = 0

        for blog in blogs:
            try:
                self.stdout.write(f'Processing: "{blog.title}"...')

                # Generate AI overview
                overview = ai_service.generate_overview(blog.title, blog.content)

                # Save to database
                blog.ai_overview = overview
                blog.save(update_fields=['ai_overview'])

                success_count += 1
                self.stdout.write(self.style.SUCCESS(f'  ✓ Generated ({len(overview)} chars)'))

            except Exception as e:
                error_count += 1
                self.stdout.write(self.style.ERROR(f'  ✗ Error: {str(e)}'))

        # Summary
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(f'Successfully generated: {success_count}'))
        if error_count > 0:
            self.stdout.write(self.style.ERROR(f'Failed: {error_count}'))
        self.stdout.write(self.style.SUCCESS('Done!'))
