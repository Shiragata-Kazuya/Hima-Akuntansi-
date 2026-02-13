const admin = require('firebase-admin');

let app = null;

function initFirebase() {
    if (!app) {
        try {
            // Parse service account from base64 env var
            const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
            
            if (!serviceAccountBase64) {
                throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is not set');
            }

            const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
            const serviceAccount = JSON.parse(serviceAccountJson);

            app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });

            console.log('✅ Firebase Admin initialized');
        } catch (error) {
            console.error('❌ Firebase initialization error:', error.message);
            throw error;
        }
    }

    return admin.firestore();
}

function setCORS(res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );
}

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