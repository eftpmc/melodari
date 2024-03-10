import { useContext } from 'react';
import { GoogleContext } from "@/contexts/GoogleContext";

// This hook could be used to make authorized API requests
function useAuthorizedApiRequest() {
  const { tokens } = useContext(GoogleContext);

  async function makeRequest(endpoint: string | URL | Request, options: RequestInit | undefined) {
    // Ensure tokens are set before making the actual request
    if (tokens) {
      try {
        await fetch('/api/ytmusic/setTokens', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tokens }),
        });

        const response = await fetch(endpoint, options);
        return await response.json();

      } catch (error) {
        console.error('Failed to make authorized request:', error);
        throw error;
      }
    } else {
      throw new Error("No tokens available for authorized request.");
    }
  }

  return makeRequest;
}

export default useAuthorizedApiRequest;