const { initFirebase, setCORS } = require('../../lib/firebase');

module.exports = async (req, res) => {
    setCORS(res);

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const db = initFirebase();
        const adminDoc = await db.collection('admin').doc('users').get();
        
        if (!adminDoc.exists) {
            return res.status(500).json({ error: 'Admin configuration not found' });
        }

        const adminData = adminDoc.data();
        const user = adminData.users.find(u => 
            u.username === username && u.password === password
        );

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create token
        const token = Buffer.from(`${username}:${password}`).toString('base64');

        res.json({
            status: 'success',
            token,
            user: {
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};
