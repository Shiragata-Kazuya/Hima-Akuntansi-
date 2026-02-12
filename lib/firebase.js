const admin = require('firebase-admin');

let firebaseInitialized = false;

/**
 * Initialize Firebase Admin SDK
 */
function initFirebase() {
    if (!firebaseInitialized) {
        try {
            // Decode Firebase credentials from environment variable
            const serviceAccount = JSON.parse(
                Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8')
            );

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });

            firebaseInitialized = true;
            console.log('✅ Firebase initialized');
        } catch (error) {
            console.error('❌ Firebase init error:', error);
            throw error;
        }
    }

    return admin.firestore();
}

/**
 * Set CORS headers
 */
function setCORS(res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );
}

/**
 * Authenticate admin user
 */
async function authenticateAdmin(req) {
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

        if (!adminDoc.exists) {
            return null;
        }

        const adminData = adminDoc.data();
        const user = adminData.users.find(u => u.username === username && u.password === password);

        return user || null;
    } catch (error) {
        console.error('Auth error:', error);
        return null;
    }
}

module.exports = {
    initFirebase,
    setCORS,
    authenticateAdmin
};
