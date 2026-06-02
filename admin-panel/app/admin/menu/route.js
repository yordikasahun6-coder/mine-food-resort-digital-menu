import { supabaseAdmin } from '@/lib/supabase'

// GET - Fetch all menu items with ratings
export async function GET() {
  // Get menu items
  const { data: menuItems, error: menuError } = await supabaseAdmin
    .from('menu_items')
    .select('*')
    .order('sort_order')
  
  if (menuError) {
    return Response.json({ error: menuError.message }, { status: 500 })
  }
  
  // Get ratings
  const { data: ratings, error: ratingError } = await supabaseAdmin
    .from('ratings')
    .select('*')
  
  if (ratingError) {
    return Response.json({ error: ratingError.message }, { status: 500 })
  }
  
  // Calculate averages
  const itemsWithRatings = menuItems.map(item => {
    const itemRatings = ratings.filter(r => r.menu_item_id === item.id)
    const avg = itemRatings.length > 0 
      ? itemRatings.reduce((sum, r) => sum + r.rating, 0) / itemRatings.length 
      : 0
    return {
      ...item,
      avg_rating: avg,
      rating_count: itemRatings.length
    }
  })
  
  return Response.json(itemsWithRatings)
}

// POST - Add new item
export async function POST(request) {
  const body = await request.json()
  
  const { data, error } = await supabaseAdmin
    .from('menu_items')
    .insert([{
      name: body.name,
      price: body.price,
      description: body.description || '',
      images: body.images || [],
      item_type: body.item_type || 'food',
      estimated_time: body.estimated_time || 15,
      is_featured: body.is_featured || false,
      is_available: body.is_available !== false,
      spice_level: body.spice_level || 'none',
      sort_order: body.sort_order || 999
    }])
    .select()
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  return Response.json(data[0])
}

// GET single item by ID
export async function GET_ITEM(request) {
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

// DELETE - Remove an item
export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return Response.json({ error: 'ID is required' }, { status: 400 })
  }
  
  const { error } = await supabaseAdmin
    .from('menu_items')
    .delete()
    .eq('id', id)
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  return Response.json({ success: true, message: 'Item deleted successfully' })
}