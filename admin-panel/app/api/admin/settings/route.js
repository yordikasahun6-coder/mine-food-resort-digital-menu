import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('admin_settings')
    .select('id, username')
    .eq('id', 1)
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ username: data.username })
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { currentUsername, currentPassword, newUsername, newPassword } = body

    // Fetch current admin data
    const { data: adminData, error: fetchError } = await supabaseAdmin
      .from('admin_settings')
      .select('username, password_hash')
      .eq('id', 1)
      .single()

    if (fetchError) {
      return Response.json({ error: 'Failed to fetch current settings' }, { status: 500 })
    }

    // Verify current username
    if (currentUsername !== adminData.username) {
      return Response.json({ error: 'Current username is incorrect' }, { status: 401 })
    }

    // Verify current password using bcrypt
    const isPasswordValid = await bcrypt.compare(currentPassword, adminData.password_hash)
    if (!isPasswordValid) {
      return Response.json({ error: 'Current password is incorrect' }, { status: 401 })
    }

    // Prepare update data
    const updateData = {}
    
    if (newUsername && newUsername !== adminData.username) {
      updateData.username = newUsername
    }
    
    if (newPassword && newPassword.length >= 6) {
      const saltRounds = 10
      updateData.password_hash = await bcrypt.hash(newPassword, saltRounds)
    }

    if (Object.keys(updateData).length === 0) {
      return Response.json({ error: 'No changes to save' }, { status: 400 })
    }

    const { error: updateError } = await supabaseAdmin
      .from('admin_settings')
      .update(updateData)
      .eq('id', 1)

    if (updateError) {
      return Response.json({ error: 'Failed to update settings' }, { status: 500 })
    }

    return Response.json({ success: true, message: 'Credentials updated successfully' })
  } catch (error) {
    console.error('Settings error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}