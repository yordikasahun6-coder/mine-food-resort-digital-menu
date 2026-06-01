'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/admin/login');
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">Redirecting to admin panel...</div>
    </div>
  );
}

{/* Estimated Time */}
<div>
  <label className="block text-[#B3945B] text-sm mb-2">PREPARATION TIME (minutes)</label>
  <input
    type="number"
    placeholder="e.g., 15"
    value={formData.estimated_time || 15}
    onChange={(e) => setFormData({...formData, estimated_time: parseInt(e.target.value)})}
    className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#B3945B]/30 text-white"
    min="1"
    max="60"
  />
</div>