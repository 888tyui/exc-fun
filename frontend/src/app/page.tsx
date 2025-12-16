'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const { publicKey } = useWallet();
  const [warriorNumber, setWarriorNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (publicKey) {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      fetch(`${apiUrl}/warrior`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: publicKey.toBase58() }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.number) {
            setWarriorNumber(data.number);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setWarriorNumber(null);
    }
  }, [publicKey]);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>exc.fun</h1>

      <div style={{ marginBottom: '2rem' }}>
        <WalletMultiButton />
      </div>

      <div className={styles.warriorText}>
        {loading ? (
          <span>Summoning...</span>
        ) : warriorNumber ? (
          <span>You are <span style={{ color: '#14F195', fontWeight: 'bold' }}>#{warriorNumber}th</span> warrior</span>
        ) : (
          <span>Connect your wallet to reveal your destiny</span>
        )}
      </div>

      <div className={styles.buttonGroup}>
        <a
          href="https://twitter.com/intent/tweet?text=I%20am%20warrior%20on%20exc.fun!&url=https://exc.fun"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className={styles.actionBtn}>
            Twitter
          </button>
        </a>
        <button className={styles.actionBtn} disabled>
          Game (Soon)
        </button>
        <button className={styles.actionBtn} disabled>
          Docs (Soon)
        </button>
      </div>
    </main>
  );
}
