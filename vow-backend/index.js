import 'dotenv/config';
import crypto from 'crypto';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json({ limit: '100kb' }));

const Card = mongoose.model(
    'Card',
    new mongoose.Schema(
        { _id: String, data: Object, keyHash: String },
        { timestamps: true, minimize: false }
    )
);

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
// the hero image URL ends up inside CSS, so only allow plain http(s) URLs
const invalid = (d) =>
    typeof d !== 'object' || d === null || (d.heroImage && !/^https?:\/\/[^\s"'()]+$/.test(d.heroImage));

app.post('/api/cards', rateLimit({ windowMs: 60_000, limit: 20 }), async (req, res) => {
    const { data } = req.body;
    if (invalid(data)) return res.status(400).json({ error: 'Invalid card' });
    const id = crypto.randomBytes(6).toString('base64url'); // 8 chars
    const editKey = crypto.randomBytes(16).toString('hex'); // proves you own the card
    await Card.create({ _id: id, data, keyHash: sha(editKey) });
    res.status(201).json({ id, editKey });
});

app.put('/api/cards/:id', async (req, res) => {
    const { data, editKey } = req.body;
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ error: 'Not found' });
    if (!editKey || sha(editKey) !== card.keyHash) return res.status(403).json({ error: 'Not allowed' });
    if (invalid(data)) return res.status(400).json({ error: 'Invalid card' });
    card.data = data;
    card.markModified('data');
    await card.save();
    res.json({ id: req.params.id });
});

app.get('/api/cards/:id', async (req, res) => {
    const card = await Card.findById(req.params.id).lean();
    if (!card) return res.status(404).json({ error: 'Not found' });
    res.json(card.data);
});

await mongoose.connect(process.env.MONGODB_URI);
app.listen(process.env.PORT || 5000, () => console.log('API ready'));