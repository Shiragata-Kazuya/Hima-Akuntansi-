const { initFirebase, setCORS } = require('../../lib/firebase');

module.exports = async (req, res) => {
    setCORS(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const db = initFirebase();

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const adminDoc = await db.collection('admin').doc('users').get();

        if (!adminDoc.exists) {
            return res.status(500).json({ error: 'Admin users not configured' });
        }

        const adminData = adminDoc.data();
        const user = adminData.users.find(u => u.username === username && u.password === password);

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate token (Base64 encoded username:password)
        const token = Buffer.from(`${username}:${password}`).toString('base64');

        return res.json({
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
        return res.status(500).json({ error: 'Login failed', details: error.message });
    }
};