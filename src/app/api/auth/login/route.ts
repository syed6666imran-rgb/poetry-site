// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Admin from '@/lib/models/Admin'
import { signToken, COOKIE_CONFIG } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    await connectDB()
    const admin = await Admin.findOne({ email: email.toLowerCase() })

    if (!admin || !(await admin.comparePassword(password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signToken({ adminId: admin._id.toString(), email: admin.email })

    const response = NextResponse.json({ success: true, message: 'Logged in' })
    response.cookies.set(COOKIE_CONFIG.name, token, {
      httpOnly: COOKIE_CONFIG.httpOnly,
      secure: COOKIE_CONFIG.secure,
      sameSite: COOKIE_CONFIG.sameSite,
      maxAge: COOKIE_CONFIG.maxAge,
      path: COOKIE_CONFIG.path,
    })

    return response
  } catch (err) {
    console.error('[AUTH LOGIN]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
