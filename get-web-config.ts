import fetch from 'node-fetch';

async function getAccessToken() {
  try {
    const url = 'http://metadata.google.internal/computeMetadata/v1/instance/service-account/default/token';
    const response = await fetch(url, {
      headers: { 'Metadata-Flavor': 'Google' }
    });
    if (!response.ok) {
      throw new Error(`Failed to get token: ${response.statusText}`);
    }
    const data: any = await response.json();
    return data.access_token;
  } catch (error) {
    console.warn("Could not get access token from Metadata Server (might not be on Cloud Run):", error);
    return null;
  }
}

async function main() {
  const token = await getAccessToken();
  if (!token) {
    console.error("No access token available. Diagnostic script completed with warning.");
    return;
  }

  const projectId = "end--to-end-data-pipeline";
  console.log(`Access Token acquired. Querying Firebase Web Apps for project: ${projectId}`);

  try {
    // 1. List Web Apps
    const listUrl = `https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps`;
    const listRes = await fetch(listUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!listRes.ok) {
      console.error(`Failed to list Web Apps: ${listRes.status} ${listRes.statusText}`);
      const errBody = await listRes.text();
      console.error("Error body:", errBody);
      return;
    }

    const listData: any = await listRes.json();
    console.log("Web Apps List Response:", JSON.stringify(listData, null, 2));

    const apps = listData.apps || [];
    for (const app of apps) {
      const appId = app.appId;
      console.log(`\nFetching config for Web App: ${appId} (${app.displayName || 'Unnamed'})`);
      
      const configUrl = `https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps/${appId}/config`;
      const configRes = await fetch(configUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (configRes.ok) {
        const configData = await configRes.json();
        console.log("Config:", JSON.stringify(configData, null, 2));
      } else {
        console.error(`Failed to get config for app ${appId}: ${configRes.status} ${configRes.statusText}`);
      }
    }
  } catch (err) {
    console.error("Error during API request:", err);
  }
}

main();
