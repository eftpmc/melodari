'use strict'

import { google, Auth } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    "http://localhost:3000/auth/callback"
);

export async function GET() {
  try {
    const scopes = [
      'https://www.googleapis.com/auth/youtube.readonly',
    ];
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });

    return new Response(JSON.stringify({ url: authUrl }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
