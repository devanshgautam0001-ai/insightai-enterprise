import firebaseConfig from "../../firebase-applet-config.json";

export interface FirebaseDiagnosticReport {
  currentDomain: string;
  projectId: string;
  authDomain: string;
  appId: string;
  apiKeyMasked: string;
  storageBucket: string;
  identityToolkitUrl: string;
  isDomainMatch: boolean;
  isValidApiKey: boolean;
  errorActionStep: string;
}

export function runFirebaseDiagnostics(error: any): FirebaseDiagnosticReport {
  const currentDomain =
    typeof window !== "undefined" ? window.location.hostname : "unknown";

  // Load config directly from firebase-applet-config.json
  const apiKey = firebaseConfig.apiKey;
  const projectId = firebaseConfig.projectId;
  const authDomain = firebaseConfig.authDomain;
  const appId = firebaseConfig.appId;
  const storageBucket = firebaseConfig.storageBucket;

  const isDomainMatch =
    currentDomain === "localhost" ||
    currentDomain === "127.0.0.1" ||
    authDomain.includes(currentDomain) ||
    currentDomain.endsWith(".run.app");

  const isValidApiKey =
    typeof apiKey === "string" &&
    apiKey.startsWith("AIzaSy") &&
    apiKey.length > 20;

  const maskedKey = isValidApiKey
    ? `${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}`
    : "INVALID";

  const identityToolkitUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${maskedKey}`;

  let errorActionStep = "Authentication failed. Check the exact Firebase error.";

  if (error?.code === "auth/operation-not-allowed") {
    errorActionStep =
      "Firebase returned OPERATION_NOT_ALLOWED. Verify that the application is using the correct Firebase Web App configuration (API Key, App ID and Project ID). Do NOT rely on environment variables if firebase-applet-config.json is the source of truth.";
  } else if (error?.code === "auth/invalid-api-key") {
    errorActionStep =
      "The Firebase Web API Key is invalid. Verify the apiKey inside firebase-applet-config.json.";
  } else if (error?.code === "auth/network-request-failed") {
    errorActionStep =
      "Network request failed. Check internet connection or firewall blocking identitytoolkit.googleapis.com.";
  }

  console.group("🔥 FIREBASE DIAGNOSTICS");
  console.log("Project ID:", projectId);
  console.log("Auth Domain:", authDomain);
  console.log("App ID:", appId);
  console.log("Storage Bucket:", storageBucket);
  console.log("API Key Present:", !!apiKey);
  console.log("API Key Valid:", isValidApiKey);
  console.log("Current Host:", currentDomain);
  console.groupEnd();

  return {
    currentDomain,
    projectId,
    authDomain,
    appId,
    apiKeyMasked: maskedKey,
    storageBucket,
    identityToolkitUrl,
    isDomainMatch,
    isValidApiKey,
    errorActionStep,
  };
}