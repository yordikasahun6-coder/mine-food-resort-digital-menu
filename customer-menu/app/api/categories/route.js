import { supabase } from '@/lib/supabase'

export async function GET() {
  // Get all categories
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .order('display_order')
  
  if (catError) {
    return Response.json({ error: catError.message }, { status: 500 })
  }
  
  // Get menu items to check which categories have items
  const { data: items, error: itemError } = await supabase
    .from('menu_items')
    .select('category_id, item_type')
    .eq('is_available', true)
  
  if (itemError) {
    return Response.json({ error: itemError.message }, { status: 500 })
  }
  
  // Count items per category
  const categoryCount = {}
  items.forEach(item => {
    if (item.category_id) {
      categoryCount[item.category_id] = (categoryCount[item.category_id] || 0) + 1
    }
  })
  
  // Filter categories that have at least one item
  const activeCategories = categories.filter(cat => categoryCount[cat.id] > 0)
  
  return Response.json(activeCategories)
}