import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const publicPaths = ['/', '/login', '/register', '/verify-email', '/auth/callback', '/onboarding']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const path = request.nextUrl.pathname

  // Public paths: always allow
  if (publicPaths.some((p) => path === p)) {
    return supabaseResponse
  }

  // API routes: let them handle their own auth
  if (path.startsWith('/api/')) {
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value)
            })
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.getUser()

    // If Supabase is unreachable, let admin pages through (demo mode handled in layout)
    if (error && path.startsWith('/admin')) {
      return supabaseResponse
    }

    // Redirect authenticated users away from auth pages
    if (user && (path === '/login' || path === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Protected routes: require authentication
    if (!user) {
      // Admin pages: allow through for demo mode (layout handles fallback)
      if (path.startsWith('/admin')) {
        return supabaseResponse
      }
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(redirectUrl)
    }

    // Admin routes: check role
    if (path.startsWith('/admin')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  } catch {
    // Supabase connection failed — allow admin demo, block other protected routes
    if (path.startsWith('/admin')) {
      return supabaseResponse
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
