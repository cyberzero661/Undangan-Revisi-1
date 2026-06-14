"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface SupabaseContextType {
  supabase: SupabaseClient | null;
  isLoading: boolean;
  isConfigured: boolean;
}

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
  isLoading: true,
  isConfigured: false,
});

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context.supabase) {
    throw new Error('useSupabase must be used within SupabaseProvider');
  }
  return context;
}

export function useSupabaseOptional() {
  return useContext(SupabaseContext);
}

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      const client = createClient(supabaseUrl, supabaseKey);
      setSupabase(client);
      setIsConfigured(true);
    } else {
      setIsConfigured(false);
      console.warn('Supabase configuration missing');
    }
    setIsLoading(false);
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase, isLoading, isConfigured }}>
      {children}
    </SupabaseContext.Provider>
  );
}
