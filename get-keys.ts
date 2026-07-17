import fetch from 'node-fetch';

async function getAccessToken() {
  try {
    const url = 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token';
    const response = await fetch(url, {
      headers: { 'Metadata-Flavor': 'Google' }
    });
    const data: any = await response.json();
    return data.access_token;
  } catch (error) {
    return null;
  }
}

async function main() {
  const token = await getAccessToken();
  if (!token) {
    console.error("No token");
    return;
  }

  const projectId = "end--to-end-data-pipeline";
  
  // Try calling apikeys API
  try {
    const url = `https://apikeys.googleapis.com/v2/projects/${projectId}/locations/global/keys`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("API Keys status:", res.status);
    const body = await res.json();
    console.log("API Keys body:", JSON.stringify(body, null, 2));
  } catch (e) {
    console.error("apikeys failed:", e);
  }

  // Try calling firebase config API directly with the specific web app ID from user instructions:
  const appId = "1:363775083450:web:6c3ae35d961d6abea5d383";
  try {
    const url = `https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps/${appId}/config`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("Firebase config status:", res.status);
    const body = await res.json();
    console.log("Firebase config body:", JSON.stringify(body, null, 2));
  } catch (e) {
    console.error("firebase config failed:", e);
  }
}

main();
