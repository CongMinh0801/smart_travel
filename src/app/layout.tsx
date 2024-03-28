import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './GlobalRedux/provider';
import Footer from '@/components/footer/footer';
import Header from '@/components/header/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Demo Booking App',
    description: 'Demo Booking App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html className="bg-white" lang="en">
            <Providers>
                <body className={inter.className}>
                    <Header />
                    <div className="flex justify-center mb-2">{children}</div>
                    <Footer />
                </body>
            </Providers>
        </html>
    );
}
