# Supabase Authentication Setup Guide

This guide explains how to set up Supabase authentication for the HYROX Session Spots application.

## 🎯 Features

- ✅ **Supabase SSR Authentication** - Server-side rendering compatible
- ✅ **Next.js Middleware Protection** - Automatic route protection
- ✅ **Email/Password Authentication** - Secure user authentication
- ✅ **Admin Route Protection** - Only authenticated users can access `/admin`
- ✅ **Auto-redirect** - Unauthenticated users redirected to login
- ✅ **Session Management** - Automatic session refresh

## 📋 Prerequisites

1. A Supabase account (https://supabase.com)
2. A Supabase project created

## 🚀 Setup Steps

### 1. Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public** key

### 2. Configure Environment Variables

Update your `.env.local` file with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Replace the placeholder values with your actual Supabase credentials.

### 3. Enable Email Authentication in Supabase

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional but recommended)

### 4. Configure Email Confirmation (Optional)

By default, Supabase requires email confirmation for new signups.

**To disable email confirmation** (for development):
1. Go to **Authentication** → **Settings**
2. Scroll to **Email Auth**
3. Disable "Enable email confirmations"

**For production**, keep email confirmation enabled for security.

## 🏗️ Architecture

### File Structure

```
src/
├── lib/supabase/
│   ├── client.ts          # Browser client
│   ├── server.ts          # Server-side client
│   └── middleware.ts      # Middleware helper
├── middleware.ts          # Next.js middleware (route protection)
└── app/
    ├── auth/
    │   ├── login/         # Login page
    │   ├── signup/        # Signup page
    │   └── callback/      # Email confirmation callback
    └── (admin)/           # Protected admin routes
        └── layout.tsx     # Admin layout with auth
```

### How It Works

1. **Middleware Protection** (`src/middleware.ts`)
   - Intercepts all requests to `/admin/*`
   - Checks if user is authenticated via Supabase session
   - Redirects unauthenticated users to `/auth/login`
   - Preserves original URL for post-login redirect

2. **Authentication Pages**
   - **Login** (`/auth/login`) - Email/password login
   - **Signup** (`/auth/signup`) - New user registration
   - **Callback** (`/auth/callback`) - Email confirmation handler

3. **Admin Layout** (`src/app/(admin)/layout.tsx`)
   - Displays current user email
   - Provides logout functionality
   - Listens for auth state changes

## 🔐 Usage

### Creating Admin Users

1. Navigate to `http://localhost:3000/auth/signup`
2. Enter email and password (minimum 6 characters)
3. If email confirmation is enabled, check your email and click the confirmation link
4. Login at `http://localhost:3000/auth/login`

### Accessing Admin Routes

- All routes under `/admin` are protected
- Unauthenticated users are automatically redirected to login
- After login, users are redirected back to the original URL

### Logout

- Click the "로그아웃" button in the admin sidebar
- Session is cleared and user is redirected to login page

## 🧪 Testing the Authentication

1. **Start the development server**:
   ```bash
   pnpm dev
   ```

2. **Test signup flow**:
   - Visit `http://localhost:3000/auth/signup`
   - Create a new account
   - Verify email if required

3. **Test login flow**:
   - Visit `http://localhost:3000/auth/login`
   - Login with created credentials

4. **Test protected routes**:
   - Try accessing `http://localhost:3000/admin` without logging in
   - Should redirect to login page
   - After login, should access admin panel successfully

5. **Test logout**:
   - Click logout button in admin sidebar
   - Should redirect to login page
   - Try accessing admin routes again (should be blocked)

## 🔒 Security Features

- **SSR Compatible**: Works with server-side rendering
- **Cookie-based Sessions**: Secure HTTP-only cookies
- **Automatic Session Refresh**: Middleware refreshes sessions automatically
- **PKCE Flow**: Secure authentication code flow
- **Route Protection**: Middleware-level protection (not client-side only)

## 🐛 Troubleshooting

### "Invalid login credentials" error
- Check that the email/password are correct
- Verify user exists in Supabase dashboard → Authentication → Users

### Infinite redirect loop
- Clear browser cookies
- Check that environment variables are set correctly
- Verify Supabase URL and anon key are valid

### Email not received
- Check spam folder
- Verify email provider settings in Supabase
- For development, disable email confirmation

### TypeScript errors
- Run `pnpm tsc --noEmit` to check for type errors
- Ensure all Supabase packages are installed: `@supabase/supabase-js`, `@supabase/ssr`

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js App Router with Supabase](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase SSR Package](https://github.com/supabase/ssr)

## 🚀 Next Steps

- [ ] Configure email templates in Supabase
- [ ] Add password reset functionality
- [ ] Implement role-based access control (RBAC)
- [ ] Add social authentication providers (Google, GitHub, etc.)
- [ ] Set up user profile management
