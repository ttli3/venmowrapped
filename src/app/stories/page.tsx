'use client';

import { useEffect, useState } from 'react';
import VenmoStories from '../components/VenmoStories';

export default function StoriesPage() {
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    const storedInsights = localStorage.getItem('venmo_insights');
    if (storedInsights) {
      setInsights(JSON.parse(storedInsights));
    }
  }, []);

  if (!insights) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white">
        <p>No insights found. Please upload your Venmo statement first.</p>
      </div>
    );
  }

  return <VenmoStories insights={insights} />;
}
