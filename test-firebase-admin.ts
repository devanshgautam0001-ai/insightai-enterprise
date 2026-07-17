import { initializeApp, getApps } from 'firebase-admin/app';
import { getProjectManagement } from 'firebase-admin/project-management';
import firebaseConfig from './firebase-applet-config.json';

async function main() {
  console.log("Initializing Firebase Admin SDK...");
  if (!getApps().length) {
    initializeApp({
      projectId: firebaseConfig.projectId,
    });
  }

  try {
    const pm = getProjectManagement();
    if (typeof (pm as any).listAppMetadata === 'function') {
      const apps = await (pm as any).listAppMetadata();
      console.log("App Metadata List:");
      console.log(JSON.stringify(apps, null, 2));
    } else {
      console.log("listAppMetadata is not a function");
    }
  } catch (error) {
    console.error("Error in listAppMetadata:", error);
  }
}

main();
