import { useContext } from 'react';
import { GoogleContext } from "@/contexts/GoogleContext";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database, Json } from '@/types/supabase';

function Common() {
    const supabase = createClientComponentClient<Database>();
    const { playlists } = useContext(GoogleContext);

    async function getUserId() {
        try {
            const { data: userData, error: userError } = await supabase.auth.getUser();

            if (userError) throw userError;
            if (!userData.user) {
                throw new Error('No authenticated user found.');
            }

            const userId = userData.user.id;
            return userId
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return getUserId;
}

export default Common;