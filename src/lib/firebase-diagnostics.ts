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
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
  const apiKey = (import.meta as any).env?.VITE_FIREBASE_API_KEY || '';
  const projectId = (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || '';
  const authDomain = (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || '';
  const appId = (import.meta as any).env?.VITE_FIREBASE_APP_ID || '';
  const storageBucket = (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || '';

  const isDomainMatch = currentDomain === 'localhost' || 
                        currentDomain === '127.0.0.1' || 
                        authDomain.includes(currentDomain) ||
                        currentDomain.endsWith('.run.app');

  const isValidApiKey = apiKey.startsWith('AIzaSy') && apiKey.length > 20;

  const maskedKey = apiKey 
    ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}` 
    : 'MISSING_OR_UNDEFINED';

  const identityToolkitUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${maskedKey}`;

  let errorActionStep = "An unexpected error occurred during authentication.";

  if (error && (error.code === 'auth/operation-not-allowed' || String(error).includes('operation-not-allowed'))) {
    errorActionStep = `The sign-in provider (Email/Password or Google) is currently disabled in your Firebase Project Console. 
    
How to resolve:
1. Open the Firebase Console for your project "${projectId || 'end--to-end-data-pipeline'}".
2. Navigate to "Build" -> "Authentication" -> "Sign-in method" tab.
3. Under "Sign-in providers", click "Add new provider" (or edit the existing one) and select "Email/Password". Enable it and click "Save".
4. If attempting Google Sign-In, also enable the "Google" provider.
5. Under "Authorized domains", verify that your application's domain "${currentDomain}" is listed. (Localhost and cloud run domains are usually auto-added, but you can manually add "${currentDomain}" if needed).`;
  } else if (error && (error.code === 'auth/invalid-api-key' || String(error).includes('invalid-api-key'))) {
    errorActionStep = `The API Key provided in your configuration is invalid or unauthorized. Please verify your VITE_FIREBASE_API_KEY environment variable.`;
  } else if (error && (error.code === 'auth/network-request-failed' || String(error).includes('network-request-failed'))) {
    errorActionStep = `Network request to Identity Toolkit failed. This can happen due to standard local network firewalls, ad blockers blocking 'identitytoolkit.googleapis.com', or DNS resolution issues.`;
  }

  return {
    currentDomain,
    projectId: projectId || 'end--to-end-data-pipeline',
    authDomain: authDomain || 'end--to-end-data-pipeline.firebaseapp.com',
    appId: appId || '1:167784001474:web:e48d194142ea5b3e91705b',
    apiKeyMasked: maskedKey,
    storageBucket: storageBucket || 'end--to-end-data-pipeline.firebasestorage.app',
    identityToolkitUrl,
    isDomainMatch,
    isValidApiKey,
    errorActionStep
  };
}
