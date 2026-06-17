import { ArrowLeft, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ContainerPublik } from '@/komponen/layout/Container';
import { Tombol } from '@/komponen/ui/tombol';

const BookingPublik = () => {
  const nav = useNavigate();
  const nomorWA = '6285772219292';
  const teks = 'Halo, saya ingin booking service di Eko Service';
  const linkWA = `https://wa.me/${nomorWA}?text=${encodeURIComponent(teks)}`;
  const tombolLanding = 'inline-flex w-full justify-center';

  return (
    <div className="h-screen bg-latar text-teks overflow-hidden">
      <ContainerPublik className="flex h-full flex-col">
        <div className="pt-8">
          <button type="button" onClick={() => nav('/')} className="inline-flex items-center gap-2 text-sm text-redup hover:text-teks">
            <ArrowLeft size={18} />
            Kembali
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-xl px-4 sm:px-0">
            <div className="kartu rounded-none space-y-4 p-6 md:p-8 text-center">
              <img src="/img/logo-whatsapp.png" alt="WhatsApp" className="mx-auto h-12 w-12" />
              <h3 className="ringkasan-title">Booking Service</h3>
              <p className="text-sm text-teks2" style={{ fontFamily: "'Farro', sans-serif", textTransform: 'none' }}>
                Klik tombol di bawah untuk langsung menghubungi admin via WhatsApp dan booking service Anda.
              </p>

              <div className="panel-kompak p-4">
                <div className="flex items-center justify-center gap-2">
                  <Phone size={16} className="text-utama" />
                  <span className="nomor-wa">Nomor Admin: 0857-7221-9292</span>
                </div>
              </div>

              <a href={linkWA} target="_blank" rel="noopener noreferrer">
                <Tombol className={`btn-bounce ${tombolLanding}`}>
                  Chat Sekarang
                </Tombol>
              </a>
            </div>
          </div>
        </div>
      </ContainerPublik>
    </div>
  );
};

export default BookingPublik;