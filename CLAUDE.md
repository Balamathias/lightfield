## Intro

Hey claude; We are going to be building a professional-grade and premium standard law firm website for a Law Firm called LightField Legal Practitioners that look very beautiful; sleek and professional. We will be modelling the structure after https://legaledge.co.uk while we maintain a cleaner and a more fine-grained version of the application. We will be building both the client-side and th server-side in NextJS and django/DRF respectively.
LightField LP is modern law firm that focuses on areas like emerging tech, AI and Blockchain (especially blockchain).

## Some Steps You Should take note of:

* Set up clean Python Views for actions including managing associates, blogs, etc (for the admins) - essentially CRUD operations with advanced feature the world is yet to see;
* Set Up clean models, build robust API endpoints accordingly for the application.
* The client-side should be animated professionally with Framer Motion, use beautiful yet professional SVG background patterns for some sections. Create and Make professional looking designs.
* Ensure that the pages, sections and contents are super-dynamic and Mobile responsive, offering rich experiences on any device!
* Set up clean components in @/components/{page_name}, where you should organize modular components for every page you will be working on. For components to be used across the entire app, you can simply put those ones in @/components folder.
* I need a clean folder structure by and by as you work this along.
* You will use Lucide React as the core icon library for this project.

* The publicly accessible side will also include AI-overview feature for blogs; there will also be an AI assistant called `Solo`, that will be a knowledge bank for this entire app; where you can ask it any question about the Law Firm, Associates and even some blogs without hallucinating.
* You will use Cloudinary for image uploads;
* We are going to use highly flexible function-based views for the views this time around; you will use cloudinary for image uploads; we need a rich user experience with great seo as well. You will also use react query side-by-side the axios client for robust data fetching,handling, state, etc. There will be the handler functions that uses axios to make the requests, and there will be reusable react hooks that calls the react functions and returns the corresponding  data. Ensure proper type safety!
* Ensure you stick to best coding practices in both Django and nextjs. In NextJS, the root pages should always be server components and any component beneath that should come of as a client component as the case may be.
* Let's make the application as interactive as possible!


## Admin
As mentioned earlier; there will be an admin managed section for professionally creating blogs, managing associates profile info and so on.
* There will be a dedicated /admin* routes for admin users to be able to login to manage the overall application.
* The feature-rich blog creation experiences will include AI-powered assistance using the python openai SDK.
* You will create clean admin-stats, charting, etc for managing the overall application.
* You will implement reorder capabilities for blogs/associates for priority listing on the publicly accessible ends.
* Use Recharts for charts


Always suggest other innovative features that could be added to the platform to improve it further.

---

Follow NextJS best practices while implementing this. Ensure that you modularize components as needed. Stufy the code to know what we are aiming for;; and as we go over it one step a time.

The primary color to be used for this main facing side is the --brand-primary color defined in @client/src/app/globals.css  

Animate professionally with framer motion

## TODO List

### Completed ✅
- [x] Admin authentication and layout
- [x] Blog posts CRUD with drag-reorder
- [x] Associates management with drag-reorder
- [x] Categories management with drag-reorder
- [x] Contacts management with status tracking
- [x] Theme toggle (dark/light mode)
- [x] Image upload with Cloudinary
- [x] Rich text editor for blogs

- [x] **Backend AI Integration** (Current)
  - [x] Configure OpenAI SDK to use Gemini
  - [x] Implement `/blogs/ai-assist/` endpoint for blog writing assistance
  - [x] Implement `/blogs/ai-overview/` endpoint for auto-generating summaries
  - [x] Implement `/solo/chat/` endpoint for knowledge base assistant
  - [x] Implement `/admin/stats/` endpoint for dashboard analytics

- [x] **Admin Dashboard Enhancement**
  - [x] Beautiful stats cards with animations
  - [x] Charts using Recharts (blog trends, contact stats)
  - [x] Recent activity feed
  - [x] Quick action buttons

- [x] **Admin AI Features UI**
  - [x] Blog AI assistant modal/sidebar in create/edit pages
  - [x] AI suggestions for titles, excerpts, SEO
  - [x] Content enhancement tools

### In Progress
- [ ] **Public Frontend Pages**
  - [ ] Homepage with hero section and animations
  - [ ] About page
  - [ ] Public Associates page
  - [ ] Public Blog listing with categories/filters
  - [ ] Individual blog post pages
  - [ ] Contact page with form
  - [ ] Solo AI assistant chat interface (public)

- [ ] **SEO & Meta**
  - [ ] Dynamic meta tags for all pages
  - [ ] Open Graph tags
  - [ ] Structured data (JSON-LD)
  - [ ] Sitemap generation
  - [ ] robots.txt

- [ ] **Final Polish**
  - [ ] Mobile responsiveness testing
  - [ ] Performance optimization
  - [ ] Loading states and skeletons
  - [ ] Error boundaries and 404 page
  - [ ] Advanced Framer Motion animations
  - [ ] Professional SVG background patterns