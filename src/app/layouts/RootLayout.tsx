import { Outlet } from 'react-router-dom';
import AuthExpiryWatcher from '@/features/auth/AuthExpiryWatcher';

/**
 * Layout akar. Halaman publik & protected masing-masing sudah membawa
 * Navbar/Footer-nya sendiri (publik) atau full-screen VR chrome sendiri
 * (eksplorasi), jadi layout ini sengaja tipis — tempat yang tepat untuk
 * menambahkan error boundary global atau toast provider di masa depan.
 */
export default function RootLayout() {
  return (
    <>
      <AuthExpiryWatcher />
      <Outlet />
    </>
  );
}
