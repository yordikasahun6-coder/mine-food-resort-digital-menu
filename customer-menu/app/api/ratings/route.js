import { supabase } from '@/lib/supabase'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const menu_item_id = searchParams.get('menu_item_id')
  
  if (menu_item_id) {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('menu_item_id', menu_item_id)
    
    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }
    return Response.json(data)
  }
  
  // Get all ratings with averages
  const { data, error } = await supabase
    .from('ratings')
    .select('*')
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  return Response.json(data)
}

export async function POST(request) {
  const body = await request.json()
  
  const { data, error } = await supabase
    .from('ratings')
    .insert([body])
    .select()
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  return Response.json(data[0])
}