# Admin Panel Setup Guide

This project uses **Supabase** for Authentication, Database, and Storage. To access the Admin Panel, follow these steps:

## 1. Supabase Project Setup

1.  Go to [Supabase](https://supabase.com/) and create a new project.
2.  **Database Migration:**
    - Open the **SQL Editor** in your Supabase dashboard.
    - Copy and paste the contents of `supabase/migrations/20251109000000_create_portfolio_items.sql` and run it. This will create the `portfolio_items` table and set up the necessary Row Level Security (RLS) policies.
3.  **Storage Setup:**
    - Go to **Storage** and create a new bucket named `portfolio`.
    - Ensure the bucket is set to **Public**.
4.  **Authentication:**
    - Go to **Authentication** -> **Users**.
    - Click **Add User** -> **Create new user**.
    - Enter the email and password you wish to use for the Admin Panel.
    - **Note:** In a production environment, you should disable public sign-ups in **Authentication** -> **Providers** -> **Email** to ensure only you can manage users.

## 2. Environment Variables

Create a `.env` file in the root of your project (you can copy `.env.example`) and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

You can find these in your Supabase dashboard under **Project Settings** -> **API**.

## 3. Accessing the Dashboard

1.  Start your development server: `npm run dev`.
2.  Click the **Login Admin** button in the website navbar.
3.  Log in with the credentials you created in Step 1.4.
4.  Once logged in, you will be redirected to the **Admin Dashboard** where you can manage your portfolio.

## 4. Troubleshooting

- **Image Upload Fails:** Ensure the `portfolio` bucket exists in Supabase Storage and that you have run the SQL migration to enable the storage policies.
- **Unauthorized Access:** The dashboard is protected. If you try to access `/admin` without being logged in, you will be redirected to the login page.
