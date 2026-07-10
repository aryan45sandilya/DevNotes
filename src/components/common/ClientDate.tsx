'use client';

// ClientDate — renders a formatted date only on the client.
// Prevents SSR/client hydration mismatches caused by dates that
// differ between server render time and browser render time.

import { useEffect, useState } from 'react';
import { formatDate, formatTime } from '@/utils/date';

interface Props {
  iso: string;
  type?: 'date' | 'time';
  className?: string;
}

export default function ClientDate({ iso, type = 'date', className }: Props) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    setLabel(type === 'time' ? formatTime(iso) : formatDate(iso));
  }, [iso, type]);

  if (!label) return null;
  return <span className={className}>{label}</span>;
}
