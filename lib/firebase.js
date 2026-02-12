const admin = require('firebase-admin');

let db = null;

/**
 * Initialize Firebase Admin SDK (singleton pattern)
 * Vercel akan reuse connection jika function masih warm
 */
const initFirebase = () => {
    if (db) return db;

    // Decode private key
    let privateKey;
    try {
        if (process.env.FIREBASE_PRIVATE_KEY_BASE64) {
            privateKey = Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, 'base64').toString('utf-8');
        } else if (process.env.FIREBASE_PRIVATE_KEY) {
            privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
        } else {
            throw new Error('FIREBASE_PRIVATE_KEY not found in environment variables');
        }
    } catch (error) {
        console.error('❌ Error loading Firebase private key:', error.message);
        throw error;
    }

    // Initialize Firebase Admin hanya sekali
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                type: "service_account",
                project_id: process.env.FIREBASE_PROJECT_ID,
                private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
                private_key: privateKey,
                client_email: process.env.FIREBASE_CLIENT_EMAIL,
                client_id: process.env.FIREBASE_CLIENT_ID,
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                token_uri: "https://oauth2.googleapis.com/token",
                auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
                client_x509_cert_url: process.env.FIREBASE_CERT_URL
            })
        });
    }

    db = admin.firestore();
    return db;
};

/**
 * Helper untuk CORS
 */
const setCORS = (res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

/**
 * Middleware autentikasi admin
 * Returns user object jika valid, null jika invalid
 */
const authenticateAdmin = async (req) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);
    
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [username, password] = decoded.split(':');
        
        const db = initFirebase();
        const adminDoc = await db.collection('admin').doc('users').get();
        const adminData = adminDoc.data();
        
        const user = adminData.users.find(u => u.username === username && u.password === password);
        
        return user || null;
    } catch (error) {
        console.error('Auth error:', error);
        return null;
    }
};

module.exports = { initFirebase, setCORS, authenticateAdmin };
