'use server'

var { google } = require('googleapis');
const oauth2Client = require('@/app/googleClient');

export async function POST(req: Request) {
  const { code } = await req.json()
  try {
    let { tokens } = await oauth2Client.getToken(code);
    
    if (tokens) {
      oauth2Client.setCredentials(tokens);
      return new Response(JSON.stringify({ tokens }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else {
      return new Response(JSON.stringify({ message: 'No playlists found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
