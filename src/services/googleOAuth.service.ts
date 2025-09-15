import axios from "axios";

export async function exchangeCodeForToken(authCode: string): Promise<any> {
  const response = await axios.post("https://oauth2.googleapis.com/token", {
    code: authCode,
    client_id: "YOUR_GOOGLE_CLIENT_ID",
    client_secret: "YOUR_GOOGLE_CLIENT_SECRET",
    redirect_uri: "YOUR_REDIRECT_URI",
    grant_type: "authorization_code",
  });
  return response.data; // Contains access_token, refresh_token, etc.
}
