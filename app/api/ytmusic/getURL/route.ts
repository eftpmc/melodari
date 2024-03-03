'use server'

var { google } = require('googleapis');

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/auth/googlecallback';
const SCOPE = 'https://www.googleapis.com/auth/youtube.readonly';

export async function GET() {
  try {
    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      REDIRECT_URI
    );

    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPE,
      include_granted_scopes: true
    });

    return new Response(JSON.stringify({ url: authorizationUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}