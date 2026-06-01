import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `menu-images/${fileName}`

    const { error, data } = await supabaseAdmin.storage
      .from('menu-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600'
      })

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    const { data: publicUrl } = supabaseAdmin.storage
      .from('menu-images')
      .getPublicUrl(filePath)

    return Response.json({ url: publicUrl.publicUrl })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}