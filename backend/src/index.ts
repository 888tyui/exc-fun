import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getOrRegisterWarrior } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.post('/warrior', async (req: Request, res: Response) => {
    try {
        const { address } = req.body;
        if (!address) {
            res.status(400).json({ error: 'Address required' });
            return;
        }

        const number = await getOrRegisterWarrior(address);
        res.json({ number });
    } catch (error) {
        console.error('Error registering warrior:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
