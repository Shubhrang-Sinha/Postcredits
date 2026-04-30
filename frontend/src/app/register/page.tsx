'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Heading, Text, Flex, Box } from '@radix-ui/themes';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await register(email, password, displayName);
    
    if (success) {
      router.push('/');
    } else {
      setError('Registration failed. Email may already be in use.');
    }
    setIsLoading(false);
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center p-4">
      <Card size="4" className="w-full max-w-md bg-white/5 border border-white/10">
        <Flex direction="column" gap="4" align="center">
          <Heading size="9" className="text-[#53e076]">
            Register
          </Heading>
          
          <form onSubmit={handleSubmit} className="w-full">
            <Flex direction="column" gap="4">
              <Box>
                <input
                  type="text"
                  placeholder="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:border-[#53e076] focus:outline-none"
                />
              </Box>
              
              <Box>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:border-[#53e076] focus:outline-none"
                />
              </Box>
              
              <Box>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:border-[#53e076] focus:outline-none"
                />
              </Box>
              
              {error && (
                <Text color="red" size="2">{error}</Text>
              )}
              
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Creating account...' : 'Register'}
              </Button>
            </Flex>
          </form>
          
          <Text align="center" size="2" className="text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-[#53e076] hover:underline">
              Login
            </Link>
          </Text>
        </Flex>
      </Card>
    </main>
  );
}