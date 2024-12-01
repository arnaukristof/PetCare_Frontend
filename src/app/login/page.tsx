'use client';

import React, { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const Login: React.FC = () => {
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const response = await fetch('http://localhost:5290/api/Login/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.Token);
        router.push('/admin');
      } else {
        alert('Incorrect username or password!');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Error, please try again!');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleLogin} className="p-6 bg-gray-100 rounded-lg shadow-md space-y-4">
        <div>
          <input
            type="text"
            name="username"
            placeholder="User name"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <Button type="submit" className="w-full">Login</Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
