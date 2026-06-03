export async function GET() {
  return Response.json({
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30),
    keyStart: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20)
  })
}