'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Logout: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('token');
    router.push('/login');
  }, [router]);

  return null;
};

export default Logout;
