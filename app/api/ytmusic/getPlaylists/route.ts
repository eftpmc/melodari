'use server'

var { google } = require('googleapis');
const oauth2Client = require('@/app/googleClient');

export async function GET() {
  try {
    var service = google.youtube('v3');
    const response = await service.playlists.list({
      auth: oauth2Client,
      part: ['snippet', 'contentDetails'],
      mine: true,
      maxResults: 20
    });

    console.log(response)
    const playlists = response.data.items;
    if (playlists) {
      return new Response(JSON.stringify({ playlists }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else {
      return new Response(JSON.stringify({ message: 'No playlists found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}