import { supabaseAdmin } from '@/lib/supabase'

// GET - Fetch restaurant settings
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('restaurant_settings')
    .select('*')
    .eq('id', 1)
    .single()
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  return Response.json(data)
}

export async function PUT(request) {
  const body = await request.json()
  
  // Convert empty strings to null for coordinates
  const latitude = body.latitude === '' || body.latitude === null ? null : parseFloat(body.latitude)
  const longitude = body.longitude === '' || body.longitude === null ? null : parseFloat(body.longitude)
  
  const { error } = await supabaseAdmin
    .from('restaurant_settings')
    .update({
      restaurant_name: body.restaurant_name,
      address: body.address,
      phone: body.phone,
      email: body.email,
      opening_hours: body.opening_hours,
      facebook_url: body.facebook_url,
      instagram_url: body.instagram_url,
      tiktok_url: body.tiktok_url,
      about_text: body.about_text,
      latitude: latitude,
      longitude: longitude,
      kodexa_url: body.kodexa_url,
      updated_at: new Date().toISOString()
    })
    .eq('id', 1)
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  return Response.json({ success: true })
}