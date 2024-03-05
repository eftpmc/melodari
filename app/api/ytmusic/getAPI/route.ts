'use server'

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_API_KEY

    return new Response(JSON.stringify({ api: apiKey }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}