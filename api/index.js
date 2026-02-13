const { initFirebase, setCORS } = require('./lib/firebase');

module.exports = async (req, res) => {
    setCORS(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const db = initFirebase();

    try {
        // Parse path: /api/home, /api/kegiatan, dll
        const path = req.url.split('?')[0].replace('/api/', '');

        // GET /api/home
        if (path === 'home' && req.method === 'GET') {
            const doc = await db.collection('home').doc('data').get();
            if (doc.exists) {
                return res.json(doc.data());
            }
            return res.status(404).json({ error: 'Data not found' });
        }

        // GET /api/kegiatan
        if (path === 'kegiatan' && req.method === 'GET') {
            const snapshot = await db.collection('kegiatan').get();
            const activities = [];
            snapshot.forEach(doc => {
                activities.push({ id: doc.id, ...doc.data() });
            });
            return res.json(activities);
        }

        // GET /api/struktur
        if (path === 'struktur' && req.method === 'GET') {
            const doc = await db.collection('struktur').doc('data').get();
            if (doc.exists) {
                return res.json(doc.data());
            }
            return res.status(404).json({ error: 'Data not found' });
        }

        // GET /api/kontak
        if (path === 'kontak' && req.method === 'GET') {
            const doc = await db.collection('kontak').doc('data').get();
            if (doc.exists) {
                return res.json(doc.data());
            }
            return res.status(404).json({ error: 'Data not found' });
        }

        // POST /api/pesan
        if (path === 'pesan' && req.method === 'POST') {
            const { name, email, message, subject } = req.body;

            if (!name || !email || !message) {
                return res.status(400).json({ error: 'All fields required' });
            }

            const newMessage = {
                name,
                email,
                message,
                subject: subject || 'No Subject',
                timestamp: new Date().toISOString(),
                read: false
            };

            await db.collection('pesan').add(newMessage);
            return res.json({ status: 'success', message: 'Message sent' });
        }

        // Route not found
        return res.status(404).json({ error: 'Endpoint not found' });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
