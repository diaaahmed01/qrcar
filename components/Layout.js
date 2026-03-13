// components/Layout.js
import Navbar from './Navbar';
import Head from 'next/head';

export default function Layout({ children, title = 'QrCar', description = 'Connect with parked car owners instantly.' }) {
  return (
    <>
      <Head>
        <title>{title} · QrCar</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen mesh-bg noise">
        <Navbar />
        <main className="relative z-10">
          {children}
        </main>
      </div>
    </>
  );
}
