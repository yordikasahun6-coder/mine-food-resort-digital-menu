import { supabaseAdmin } from '@/lib/supabase'

// GET - Fetch all categories
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('display_order')
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  return Response.json(data)
}

// POST - Create a new category
export async function POST(request) {
  const body = await request.json()
  
  // Get max display_order
  const { data: maxOrder } = await supabaseAdmin
    .from('categories')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
  
  const newOrder = (maxOrder && maxOrder[0]?.display_order || 0) + 1
  
  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert([{ 
      name: body.name,
      display_order: newOrder
    }])
    .select()
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  return Response.json(data[0])
}

// DELETE - Delete a category
export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return Response.json({ error: 'ID is required' }, { status: 400 })
  }
  
  // First, set category_id to NULL for all menu items using this category
  await supabaseAdmin
    .from('menu_items')
    .update({ category_id: null })
    .eq('category_id', id)
  
  // Then delete the category
  const { error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', id)
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  return Response.json({ success: true })
}