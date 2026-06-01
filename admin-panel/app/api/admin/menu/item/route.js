import { supabaseAdmin } from '@/lib/supabase'

// GET - Fetch single item by ID
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return Response.json({ error: 'ID is required' }, { status: 400 })
  }
  
  const { data, error } = await supabaseAdmin
    .from('menu_items')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  return Response.json(data)
}

// PUT - Update an item
export async function PUT(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const body = await request.json()
  
  if (!id) {
    return Response.json({ error: 'ID is required' }, { status: 400 })
  }
  
  const { data, error } = await supabaseAdmin
    .from('menu_items')
    .update({
      name: body.name,
      price: body.price,
      description: body.description || '',
      images: body.images || [],
      item_type: body.item_type || 'food',
      estimated_time: body.estimated_time || 15,
      is_featured: body.is_featured || false,
      is_available: body.is_available !== false,
      spice_level: body.spice_level || 'none'
    })
    .eq('id', id)
    .select()
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  return Response.json(data[0])
}