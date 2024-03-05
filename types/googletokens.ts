export interface GoogleTokens {
    access_token: string;
    expiry_date: number;
    id_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
}

export interface SupabaseLabel {
    tokens: GoogleTokens;
}

export interface TokenArray {
    google_tokens: GoogleTokens;
}