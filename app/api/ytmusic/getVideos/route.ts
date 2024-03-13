'use server'

var { google } = require('googleapis');
const oauth2Client = require('@/app/googleClient');

export async function POST(req: Request) {
  const { playlistId, tokens } = await req.json()
  console.log(tokens)
  try {
    oauth2Client.setCredentials(tokens)
    var service = google.youtube('v3');
    const response = await service.playlistItems.list({
      auth: oauth2Client,
      playlistId: playlistId,
      part: ['snippet', 'contentDetails',],
      maxResults: 20
    });

    const videos = response.data.items;
    if (videos) {
      return new Response(JSON.stringify({ videos }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else {
      return new Response(JSON.stringify({ message: 'No videos found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}