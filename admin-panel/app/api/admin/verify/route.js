import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return Response.json({ valid: false, error: 'Username and password required' }, { status: 400 })
    }

    // Fetch admin from database
    const { data, error } = await supabaseAdmin
      .from('admin_settings')
      .select('username, password_hash')
      .eq('username', username)
      .single()

    if (error || !data) {
      return Response.json({ valid: false, error: 'Invalid credentials' }, { status: 401 })
    }

    // Verify password using bcrypt
    const isValid = await bcrypt.compare(password, data.password_hash)

    if (!isValid) {
      return Response.json({ valid: false, error: 'Invalid credentials' }, { status: 401 })
    }

    return Response.json({ valid: true })
  } catch (error) {
    console.error('Verification error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}