'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button, Flex, Text } from '@radix-ui/themes';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b border-white/10 bg-[#191111]/80 sticky top-0 z-50">
      <Flex 
        justify="between" 
        align="center" 
        py="3" 
        px="5" 
        style={{ maxWidth: 1400, margin: '0 auto' }}
      >
        <Link href="/">
          <Text size="6" weight="bold" className="text-[#53e076]">Postcredits</Text>
        </Link>
        
        <Flex gap="3" align="center">
          {isAuthenticated ? (
            <>
              <Link href="/">
                <Button variant="soft" color="gray">Home</Button>
              </Link>
              <Link href="/movies">
                <Button variant="soft" color="gray">Movies</Button>
              </Link>
              <Link href="/books">
                <Button variant="soft" color="gray">Books</Button>
              </Link>
              <Link href="/watchlist">
                <Button variant="soft" color="gray">Watchlist</Button>
              </Link>
              <Link href="/stats">
                <Button variant="soft" color="gray">Stats</Button>
              </Link>
              <Text size="2" className="text-gray-400 ml-2">{user?.email}</Text>
              <Button variant="outline" color="red" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </Flex>
      </Flex>
    </header>
  );
}