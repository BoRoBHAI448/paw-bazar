import './globals.css';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'Pawbazar - Premium Cat Food Store',
  description: 'Buy premium cat food, wet food, and treats for your loving cats.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}