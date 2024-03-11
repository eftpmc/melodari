export interface Playlist {
    snippet: {
        title: string;
        thumbnails: {
            maxres: {
                url: string
            }
        },
    };
}

export interface PlaylistLabel {
    playlists: Playlist[];
}