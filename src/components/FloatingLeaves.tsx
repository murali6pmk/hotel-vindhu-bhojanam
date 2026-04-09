import { useEffect, useState } from 'react';

interface Leaf {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  emoji: string;
}

export default function FloatingLeaves() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const emojis = ['🍃', '🌿', '🍀', '🌺', '🌸'];
    const newLeaves = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 6,
      size: 14 + Math.random() * 10,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setLeaves(newLeaves);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute"
          style={{
            left: `${leaf.left}%`,
            top: '-30px',
            fontSize: `${leaf.size}px`,
            animation: `leafFall ${leaf.duration}s ${leaf.delay}s linear infinite`,
            opacity: 0.4,
          }}
        >
          {leaf.emoji}
        </div>
      ))}
    </div>
  );
}
