// Script untuk encode Firebase private key ke base64
// Gunakan ini untuk set environment variable FIREBASE_PRIVATE_KEY_BASE64

const fs = require('fs');

// Read firebase-key.json
const serviceAccount = JSON.parse(fs.readFileSync('./firebase-key.json', 'utf8'));

// Extract private key
const privateKey = serviceAccount.private_key;

// Encode to base64
const base64Key = Buffer.from(privateKey).toString('base64');

console.log('===================================');
console.log('FIREBASE PRIVATE KEY (BASE64)');
console.log('===================================');
console.log(base64Key);
console.log('===================================');
console.log('\n✅ Copy nilai di atas dan set sebagai FIREBASE_PRIVATE_KEY_BASE64 di Vercel Environment Variables');
console.log('\n📋 Environment Variables yang perlu diset di Vercel:');
console.log(`
FIREBASE_PROJECT_ID=${serviceAccount.project_id}
FIREBASE_PRIVATE_KEY_BASE64=${base64Key}
FIREBASE_PRIVATE_KEY_ID=${serviceAccount.private_key_id}
FIREBASE_CLIENT_EMAIL=${serviceAccount.client_email}
FIREBASE_CLIENT_ID=${serviceAccount.client_id}
FIREBASE_CERT_URL=${serviceAccount.client_x509_cert_url}
`);
