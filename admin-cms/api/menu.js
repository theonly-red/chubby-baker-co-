const { getFile, putFile } = require('../lib/github');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { content } = await getFile('data/menu.json');
      res.status(200).json({ menu: JSON.parse(content || '[]') });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (!body || typeof body === 'string') body = JSON.parse(body || '{}');
      const { menu } = body || {};
      if (!Array.isArray(menu) || menu.length > 50 || JSON.stringify(menu).length > 200000) {
        return res.status(400).json({ error: 'Invalid menu' });
      }

      const { sha } = await getFile('data/menu.json');
      const content = JSON.stringify(menu, null, 2) + '\n';
      await putFile('data/menu.json', content, 'Update menu via admin panel', sha);
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};
