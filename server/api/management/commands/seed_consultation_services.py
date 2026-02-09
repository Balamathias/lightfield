from django.core.management.base import BaseCommand
from api.models import ConsultationService


SERVICES = [
    {
        'name': 'AI & Technology Law Consultation',
        'description': (
            'Navigate the rapidly evolving landscape of artificial intelligence regulation '
            'with our expert legal team. This consultation covers AI deployment compliance, '
            'algorithmic accountability frameworks, liability assessment for autonomous systems, '
            'data governance requirements, and strategic guidance on upcoming AI legislation. '
            'Whether you are developing AI products, deploying machine learning models, or '
            'seeking to understand your obligations under AI regulation, our attorneys provide '
            'clear, actionable counsel tailored to your situation.'
        ),
        'short_description': 'Expert counsel on AI regulation, compliance, and deployment frameworks.',
        'category': 'ai_law',
        'price': 75000,
        'duration_minutes': 60,
        'icon_name': 'Brain',
        'order_priority': 1,
        'is_featured': True,
    },
    {
        'name': 'Blockchain & Digital Assets Advisory',
        'description': (
            'Comprehensive legal guidance on blockchain technology, cryptocurrency, and '
            'digital asset regulation. Our consultation addresses smart contract legal '
            'frameworks, token classification and compliance, DeFi protocol governance, '
            'NFT marketplace regulations, and cross-border digital asset transactions. '
            'We help startups, exchanges, and institutional investors navigate the complex '
            'regulatory environment surrounding distributed ledger technologies with '
            'confidence and clarity.'
        ),
        'short_description': 'Legal guidance on blockchain, crypto regulation, and digital assets.',
        'category': 'blockchain',
        'price': 80000,
        'duration_minutes': 60,
        'icon_name': 'Blocks',
        'order_priority': 2,
        'is_featured': True,
    },
    {
        'name': 'Data Privacy & Protection Review',
        'description': (
            'Protect your organization and your users with a thorough data privacy '
            'consultation. We cover NDPA compliance, GDPR obligations for Nigerian businesses '
            'with international operations, data processing agreements, privacy impact '
            'assessments, breach notification procedures, and cross-border data transfer '
            'mechanisms. Our team helps you build a robust privacy framework that safeguards '
            'personal data while enabling your business to operate effectively.'
        ),
        'short_description': 'NDPA/GDPR compliance, privacy audits, and data protection strategy.',
        'category': 'data_privacy',
        'price': 65000,
        'duration_minutes': 60,
        'icon_name': 'Shield',
        'order_priority': 3,
        'is_featured': True,
    },
    {
        'name': 'Technology Contracts & Agreements',
        'description': (
            'Expert review and drafting of technology-related contracts and agreements. '
            'This consultation covers SaaS agreements, software licensing, API terms of '
            'service, cloud computing contracts, IT outsourcing agreements, technology '
            'partnership frameworks, and vendor management contracts. We ensure your '
            'agreements are comprehensive, enforceable, and protect your interests in '
            'an increasingly digital business environment.'
        ),
        'short_description': 'Review and drafting of SaaS, licensing, and tech agreements.',
        'category': 'tech_contracts',
        'price': 60000,
        'duration_minutes': 45,
        'icon_name': 'FileCode',
        'order_priority': 4,
        'is_featured': False,
    },
    {
        'name': 'Intellectual Property Strategy',
        'description': (
            'Secure and monetize your innovations with strategic IP counsel. Our '
            'consultation addresses patent strategy for technology inventions, trademark '
            'registration and protection, trade secret policies, copyright for software '
            'and digital content, IP licensing and commercialization, and technology '
            'transfer agreements. We work with startups and established enterprises to '
            'build comprehensive IP portfolios that create lasting competitive advantages.'
        ),
        'short_description': 'Patent, trademark, and IP protection for tech innovations.',
        'category': 'ip',
        'price': 70000,
        'duration_minutes': 60,
        'icon_name': 'Lightbulb',
        'order_priority': 5,
        'is_featured': True,
    },
    {
        'name': 'Corporate & Startup Advisory',
        'description': (
            'Strategic corporate legal counsel for technology companies at every stage. '
            'This consultation covers company formation and structuring, fundraising and '
            'investment documentation, shareholders agreements, corporate governance, '
            'regulatory compliance, M&A transactions, and board advisory services. '
            'Our attorneys understand the unique challenges facing tech startups and '
            'enterprises, providing practical counsel that supports growth and innovation.'
        ),
        'short_description': 'Company formation, fundraising, governance, and M&A advisory.',
        'category': 'corporate',
        'price': 85000,
        'duration_minutes': 90,
        'icon_name': 'Building2',
        'order_priority': 6,
        'is_featured': False,
    },
    {
        'name': 'Smart Contract Audit & Legal Review',
        'description': (
            'Combined legal and technical review of smart contracts and decentralized '
            'protocols. This specialized consultation examines the legal enforceability '
            'of smart contract terms, identifies regulatory compliance gaps, assesses '
            'liability exposure, reviews governance mechanisms, and provides recommendations '
            'for risk mitigation. Ideal for DeFi projects, DAOs, and any organization '
            'deploying smart contracts on public or private blockchains.'
        ),
        'short_description': 'Legal enforceability review and risk assessment for smart contracts.',
        'category': 'blockchain',
        'price': 100000,
        'duration_minutes': 90,
        'icon_name': 'ScrollText',
        'order_priority': 7,
        'is_featured': False,
    },
    {
        'name': 'Regulatory Compliance Consultation',
        'description': (
            'Stay ahead of evolving technology regulations with proactive compliance counsel. '
            'This consultation covers fintech licensing requirements, payment systems '
            'regulation, cybersecurity compliance frameworks, sector-specific tech regulations, '
            'and cross-border regulatory considerations. We help you build compliance '
            'programs that protect your business while enabling innovation in fast-moving '
            'regulatory environments.'
        ),
        'short_description': 'Fintech licensing, cybersecurity compliance, and regulatory strategy.',
        'category': 'other',
        'price': 55000,
        'duration_minutes': 45,
        'icon_name': 'Scale',
        'order_priority': 8,
        'is_featured': False,
    },
]


class Command(BaseCommand):
    help = 'Seed the database with consultation services'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Remove all existing services before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            count = ConsultationService.objects.count()
            ConsultationService.objects.all().delete()
            self.stdout.write(self.style.WARNING(f'Deleted {count} existing services'))

        created = 0
        skipped = 0

        for data in SERVICES:
            _, was_created = ConsultationService.objects.get_or_create(
                name=data['name'],
                defaults=data,
            )
            if was_created:
                created += 1
            else:
                skipped += 1

        self.stdout.write(
            self.style.SUCCESS(f'Done: {created} created, {skipped} already existed')
        )
