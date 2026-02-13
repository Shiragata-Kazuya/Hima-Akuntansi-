const { initFirebase, setCORS } = require('../lib/firebase');

module.exports = async (req, res) => {
    // Set CORS headers
    setCORS(res);

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only POST allowed
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Initialize Firebase
        const db = initFirebase();

        // Get credentials from request body
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                error: 'Username and password required' 
            });
        }

        // Get admin users from Firestore
        const adminDoc = await db.collection('admin').doc('users').get();

        if (!adminDoc.exists) {
            console.error('Admin users document not found in Firestore');
            return res.status(500).json({ 
                error: 'Admin configuration not found' 
            });
        }

        const adminData = adminDoc.data();
        
        if (!adminData || !adminData.users) {
            console.error('Invalid admin data structure');
            return res.status(500).json({ 
                error: 'Invalid admin configuration' 
            });
        }

        // Find user
        const user = adminData.users.find(
            u => u.username === username && u.password === password
        );

        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid username or password' 
            });
        }

        // Generate token
        const token = Buffer.from(`${username}:${password}`).toString('base64');

        // Return success
        return res.status(200).json({
            status: 'success',
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};