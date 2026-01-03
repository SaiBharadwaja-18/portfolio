# Portfolio Website Setup Guide

## Overview

A modern, bilingual (English/Japanese) personal portfolio website with a complete admin CMS built with Next.js, Supabase, and Tailwind CSS.

## Features

✅ Bilingual support (EN/JP toggle)
✅ Fully responsive design
✅ Admin CMS for content management
✅ Blog system with Markdown support
✅ Mixed aspect ratio image handling (masonry layout)
✅ Japanese audio feature for blog posts
✅ Certifications & documents gallery
✅ Projects showcase
✅ Research publications
✅ Achievements & conferences
✅ Skills section
✅ Smooth animations with Framer Motion

## Database Setup

The database is already configured in Supabase with the following tables:
- `blogs` - Blog posts with bilingual content
- `projects` - Project portfolio
- `research` - Research publications
- `achievements` - Awards and recognition
- `conferences` - Conference participation
- `certifications` - Certificates and documents
- `skills` - Skills and expertise
- `profile` - Profile information

All tables have Row Level Security (RLS) enabled:
- Public read access for published content
- Admin-only write access (authenticated users)

## Admin Access

### Creating an Admin User

1. Go to your Supabase dashboard
2. Navigate to Authentication > Users
3. Click "Add User" → "Create new user"
4. Enter email and password
5. The user will be able to access the admin panel

### Admin Panel Access

1. Visit `/admin` on your website
2. Login with your Supabase credentials
3. Access the dashboard to manage all content

## Admin Features

The admin dashboard provides CRUD operations for:
- Profile management
- Blog posts (with draft/published status)
- Projects
- Research publications
- Achievements
- Conferences
- Certifications & documents
- Skills

## Content Management Guide

### Adding Blog Posts

1. Go to Admin Dashboard > Blogs
2. Fill in the form:
   - Title (EN) - Required
   - Title (JP) - Optional
   - Slug - URL-friendly identifier (e.g., "my-first-post")
   - Category - Blog category
   - Content (EN) - Supports Markdown
   - Content (JP) - Optional Japanese version
   - Images - Comma-separated URLs
   - Audio URL - Optional Japanese audio file
   - Status - Draft or Published

### Adding Projects

1. Go to Admin Dashboard > Projects
2. Enter project details in both languages
3. Add image URLs (comma-separated)
4. List technologies used (comma-separated)
5. Add project and GitHub links

### Image Management

Images can be:
- External URLs (e.g., from Pexels, Unsplash)
- Uploaded to Supabase Storage
- Hosted on any CDN

For multiple images, enter comma-separated URLs:
```
https://example.com/image1.jpg, https://example.com/image2.jpg
```

The masonry grid will automatically handle different aspect ratios.

### Japanese Audio Feature

For blog posts with Japanese audio:
1. Upload audio file to hosting service
2. Enter the audio URL in the "Audio URL" field
3. If no audio is provided, an indicator shows "Coming Soon"

## Customization

### Profile Information

Update profile details in Admin Dashboard > Profile:
- Name (EN/JP)
- Tagline (EN/JP)
- Bio (EN/JP)
- Avatar URL
- Resume URLs (EN/JP)
- Social links (Email, GitHub, LinkedIn, Twitter)

### Styling

The website uses:
- Tailwind CSS for styling
- Clean, minimal design with plenty of whitespace
- Blue accent color (can be customized in components)
- Responsive breakpoints for mobile/tablet/desktop

### Animations

Framer Motion is used throughout for:
- Page transitions
- Scroll-triggered fade-ins
- Hover effects
- Smooth interactions

## Deployment

The site is ready to deploy. Make sure to:
1. Set environment variables in your hosting platform
2. Deploy to Vercel, Netlify, or any Next.js-compatible host
3. Ensure Supabase credentials are properly configured

## Pages Structure

- `/` - Home page with hero section
- `/about` - About page with skills
- `/research` - Research publications
- `/projects` - Projects showcase
- `/blog` - Blog listing
- `/blog/[slug]` - Individual blog post
- `/achievements` - Awards and conferences
- `/certifications` - Certificates and documents
- `/contact` - Contact information
- `/admin` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/dashboard/*` - Content management pages

## Technology Stack

- **Framework**: Next.js 13 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Markdown**: react-markdown

## Security

- All database tables have RLS enabled
- Admin routes require authentication
- No sensitive data hardcoded
- CSRF protection via Supabase
- Secure session management

## Support

For issues or questions:
1. Check the Supabase dashboard for database issues
2. Review browser console for frontend errors
3. Check server logs for backend issues
4. Verify authentication is working correctly

## Next Steps

1. Create an admin user in Supabase
2. Login to the admin panel
3. Add your profile information
4. Start adding content (blogs, projects, etc.)
5. Customize colors and styling if needed
6. Deploy to production

Enjoy your new portfolio website!
