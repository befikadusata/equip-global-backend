// Helper to normalize private key format for Google Auth
function normalizePrivateKey(key) {
  // Ensure we have proper line breaks regardless of how the environment variable was set
  let normalized = key;
  
  // Replace escaped newlines with actual newlines if they exist
  if (normalized.includes('\\n')) {
    normalized = normalized.replace(/\\n/g, '\n');
  }
  if (normalized.includes('\\r')) {
    normalized = normalized.replace(/\\r/g, '\r');
  }
  
  // Ensure proper BEGIN/END markers with newlines
  if (!normalized.trim().startsWith('-----BEGIN PRIVATE KEY-----\n')) {
    normalized = normalized.replace(/-----BEGIN PRIVATE KEY-----/, '-----BEGIN PRIVATE KEY-----\n');
  }
  if (!normalized.trim().endsWith('\n-----END PRIVATE KEY-----')) {
    normalized = normalized.replace(/-----END PRIVATE KEY-----/, '\n-----END PRIVATE KEY-----');
  }
  
  // Clean up any extra whitespace
  normalized = normalized.trim();
  
  return normalized;
}

export { normalizePrivateKey };