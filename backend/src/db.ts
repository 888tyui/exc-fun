import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function getOrRegisterWarrior(address: string): Promise<number> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Create table if not exists
        await client.query(`
      CREATE TABLE IF NOT EXISTS warriors (
        address VARCHAR(255) PRIMARY KEY,
        sequence_number SERIAL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // Check if exists
        const res = await client.query('SELECT sequence_number FROM warriors WHERE address = $1', [address]);
        if (res.rows.length > 0) {
            await client.query('COMMIT');
            return res.rows[0].sequence_number;
        }

        // Insert new
        const insertRes = await client.query(
            'INSERT INTO warriors (address) VALUES ($1) RETURNING sequence_number',
            [address]
        );

        await client.query('COMMIT');
        return insertRes.rows[0].sequence_number;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}
