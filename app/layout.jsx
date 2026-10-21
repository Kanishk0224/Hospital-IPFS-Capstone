import './globals.css';
import { AppProvider } from '../components/AppContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import IpfsModal from '../components/IpfsModal';

export const metadata = {
  title: 'MediCare+ | Modern Hospital Management & Medical Record System',
  description: 'Enterprise healthcare portal with real-time specialist doctor booking, electronic medical records (EHR), and decentralized IPFS storage.',
  keywords: 'hospital management, doctor appointment, medical records, EHR, IPFS healthcare',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <AppProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toast />
          <IpfsModal />
        </AppProvider>
      </body>
    </html>
  );
}
