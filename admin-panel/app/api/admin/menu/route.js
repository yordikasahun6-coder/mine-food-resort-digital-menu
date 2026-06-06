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
  
  console.log('Received POST data:', body) // Debug log
  
  const { data, error } = await supabaseAdmin
    .from('menu_items')
    .insert([{
      name: body.name,
      price: body.price,
      description: body.description || '',
      images: body.images || [],
      item_type: body.item_type || 'food',
      category_id: body.category_id || null,
      estimated_time: body.estimated_time || 15,
      is_featured: body.is_featured || false,
      is_available: body.is_available !== false,
      spice_level: body.spice_level || 'none',
      sort_order: body.sort_order || 999
    }])
    .select()
  
  if (error) {
    console.error('Supabase error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  console.log('Item saved with category_id:', data[0].category_id)
  return Response.json(data[0])
}


// PUT - Update an item
export async function PUT(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const body = await request.json()
  
  console.log('Received PUT data:', body) // Debug log
  
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
      category_id: body.category_id || null,
      estimated_time: body.estimated_time || 15,
      is_featured: body.is_featured || false,
      is_available: body.is_available !== false,
      spice_level: body.spice_level || 'none'
    })
    .eq('id', id)
    .select()
  
  if (error) {
    console.error('Supabase error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  return Response.json(data[0])
}


// DELETE - Remove an item
export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  console.log('DELETE called for ID:', id)
  
  if (!id) {
    return Response.json({ error: 'No ID provided' }, { status: 400 })
  }
  
  // Simple delete without select
  const { error } = await supabaseAdmin
    .from('menu_items')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Delete error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  // Verify the item is gone
  const { data: check, error: checkError } = await supabaseAdmin
    .from('menu_items')
    .select('id')
    .eq('id', id)
    .single()
  
  if (checkError && checkError.code === 'PGRST116') {
    // PGRST116 means no rows returned - item is deleted
    console.log('Item successfully deleted:', id)
    return Response.json({ success: true, deleted: true })
  } else if (check) {
    console.log('Item still exists! Delete failed')
    return Response.json({ error: 'Delete failed - item still exists' }, { status: 500 })
  }
  
  return Response.json({ success: true, deleted: true })
}