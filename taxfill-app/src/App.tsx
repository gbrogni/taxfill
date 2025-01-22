import { RouterProvider } from 'react-router-dom';
import './global.css';
import { router } from './routes';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme/theme-provider';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';

export function App() {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="dark" storageKey="taxfill-theme">
        <Helmet titleTemplate="Simulador de declaração de imposto de renda" />
        <Toaster richColors />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}