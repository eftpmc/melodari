export interface Playlist {
    id: string,
    snippet: {
        title: string;
        thumbnails: {
            maxres: {
                url: string
            }
        },
    };
}

export type PlaylistLabel {
    playlists: Playlist[];
}