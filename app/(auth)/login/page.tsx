// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // SECURITY FIX: State for TOTP verification
  const [totpToken, setTotpToken] = useState('');
  const [requiresTOTP, setRequiresTOTP] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // SECURITY FIX: Send TOTP token if required
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password,
          ...(requiresTOTP && { totpToken }) // Include TOTP token if needed
        }),
      });

      const data = await res.json();

      // SECURITY FIX: Handle TOTP requirement
      if (data.requiresTOTP && !requiresTOTP) {
        setRequiresTOTP(true);
        setPassword(''); // Clear password from state for security
        return;
      }

      if (res.ok) {
        router.push('/admin');
      } else {
        setError(data.error || 'Incorrect credentials');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="h-screen max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">
        {requiresTOTP ? '2FA Verification' : 'Sign In'}
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        {!requiresTOTP ? (
          <>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 mb-4 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 mb-4 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        ) : (
          // SECURITY FIX: TOTP input for 2FA
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Enter the 6-digit code from your authenticator app
            </p>
            <input
              type="text"
              placeholder="000000"
              className="w-full p-2 mb-4 border rounded text-center tracking-widest text-2xl"
              value={totpToken}
              onChange={(e) => setTotpToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {requiresTOTP ? 'Verify' : 'Sign In'}        </button>
      </form>
    </div>
  );
}