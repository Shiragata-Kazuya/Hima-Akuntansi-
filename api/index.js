const { initFirebase, setCORS, authenticateAdmin } = require('../../lib/firebase');

module.exports = async (req, res) => {
    setCORS(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const db = initFirebase();

    // Authenticate (except for login endpoint)
    const user = await authenticateAdmin(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Parse path
        const fullPath = req.url.split('?')[0];
        const pathParts = fullPath.split('/').filter(Boolean);
        
        // pathParts akan jadi: ['api', 'admin', 'pesan'] atau ['api', 'admin', 'home']
        const resource = pathParts[2]; // pesan, home, kegiatan, struktur, kontak
        const id = pathParts[3]; // optional ID
        const action = pathParts[4]; // optional action (e.g., 'read')

        // === PESAN ENDPOINTS ===
        
        // GET /api/admin/pesan - Get all messages
        if (resource === 'pesan' && req.method === 'GET' && !id) {
            const snapshot = await db.collection('pesan').orderBy('timestamp', 'desc').get();
            const messages = [];
            snapshot.forEach(doc => {
                messages.push({ id: doc.id, ...doc.data() });
            });
            return res.json(messages);
        }

        // DELETE /api/admin/pesan/:id - Delete message
        if (resource === 'pesan' && req.method === 'DELETE' && id) {
            await db.collection('pesan').doc(id).delete();
            return res.json({ status: 'success', message: 'Message deleted' });
        }

        // PATCH /api/admin/pesan/:id/read - Mark as read
        if (resource === 'pesan' && req.method === 'PATCH' && id && action === 'read') {
            await db.collection('pesan').doc(id).update({ read: true });
            return res.json({ status: 'success' });
        }

        // === HOME ENDPOINTS ===
        
        // PUT /api/admin/home - Update home data
        if (resource === 'home' && req.method === 'PUT') {
            await db.collection('home').doc('data').set(req.body);
            return res.json({ status: 'success', message: 'Home data updated' });
        }

        // === KEGIATAN ENDPOINTS ===
        
        // POST /api/admin/kegiatan - Add activity
        if (resource === 'kegiatan' && req.method === 'POST') {
            const activityData = req.body;
            const newDoc = await db.collection('kegiatan').add(activityData);
            return res.json({ status: 'success', id: newDoc.id });
        }

        // PUT /api/admin/kegiatan/:id - Update activity
        if (resource === 'kegiatan' && req.method === 'PUT' && id) {
            await db.collection('kegiatan').doc(id).update(req.body);
            return res.json({ status: 'success', message: 'Activity updated' });
        }

        // DELETE /api/admin/kegiatan/:id - Delete activity
        if (resource === 'kegiatan' && req.method === 'DELETE' && id) {
            await db.collection('kegiatan').doc(id).delete();
            return res.json({ status: 'success', message: 'Activity deleted' });
        }

        // === STRUKTUR ENDPOINTS ===
        
        // PUT /api/admin/struktur - Update struktur
        if (resource === 'struktur' && req.method === 'PUT') {
            await db.collection('struktur').doc('data').set(req.body);
            return res.json({ status: 'success', message: 'Struktur data updated' });
        }

        // === KONTAK ENDPOINTS ===
        
        // PUT /api/admin/kontak - Update kontak
        if (resource === 'kontak' && req.method === 'PUT') {
            await db.collection('kontak').doc('data').set(req.body);
            return res.json({ status: 'success', message: 'Kontak data updated' });
        }

        // Route not found
        return res.status(404).json({ error: 'Admin endpoint not found' });

    } catch (error) {
        console.error('Admin API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
