import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#121820',
            color: '#E8EDF5',
            border: '1px solid #1E2837',
            borderRadius: '10px',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#00D4FF', secondary: '#07090F' },
          },
          error: {
            iconTheme: { primary: '#FF5C00', secondary: '#fff' },
          },
        }}
      />
    </>
  );
}
