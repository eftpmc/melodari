'use server'

var { google } = require('googleapis');
const oauth2Client = require('@/app/googleClient');

const SCOPE = 'https://www.googleapis.com/auth/youtube.readonly';

export async function GET() {
  try {
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