import { supabaseAdmin } from '@/lib/supabase'

// GET - Fetch single item
export async function GET(request, { params }) {
  const { id } = await params
  
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
export async function PUT(request, { params }) {
  const { id } = await params
  const body = await request.json()
  
  const { data, error } = await supabaseAdmin
    .from('menu_items')
    .update(body)
    .eq('id', id)
    .select()
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  return Response.json(data[0])
}

// DELETE - Remove an item
export async function DELETE(request, { params }) {
  const { id } = await params
  
  const { error } = await supabaseAdmin
    .from('menu_items')
    .delete()
    .eq('id', id)
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  return Response.json({ success: true })
}