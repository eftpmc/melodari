export interface Playlist {
    snippet: {
      title: string;
    };
  }  

export interface PlaylistLabel {
    playlists: Playlist;
}