import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import ErrorState from '@/components/ErrorState';
import { useHeritageSites } from '@/features/heritage/hooks';

export default function LandingPage() {
  const sitesQuery = useHeritageSites();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="bg-gradient-to-b from-brand-50 to-slate-50 px-4 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          Pembelajaran Geometri Berbasis VR/WebXR
        </p>
        <h1 className="mx-auto mt-3 max-w-2xl text-4xl font-extrabold text-slate-900">
          Jelajahi Candi, Temukan Geometri
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">
          VR-GeoNusa membantu siswa SMP mempelajari konsep geometri lewat eksplorasi panorama 360°
          situs warisan budaya Indonesia, dimulai dari Candi Borobudur.
        </p>
        <div className="mt-6">
          <Link to="/destinations/borobudur">
            <Button>Mulai Jelajahi Borobudur</Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Tentang VR-GeoNusa</h2>
        <p className="mt-3 text-slate-600">
          Setiap panorama dilengkapi identifikasi objek berbasis Machine Learning untuk membantu
          siswa mengenali bentuk geometri pada elemen arsitektur, lalu mempelajari materi dan kuis
          singkat yang relevan — semua tanpa harus meninggalkan pengalaman VR.
        </p>
      </section>

      <section id="destinations" className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="text-center text-2xl font-bold text-slate-900">Destinasi</h2>
        <div className="mt-6">
          {sitesQuery.isLoading && (
            <div className="flex justify-center">
              <Spinner label="Memuat destinasi..." />
            </div>
          )}
          {sitesQuery.isError && <ErrorState error={sitesQuery.error} onRetry={() => sitesQuery.refetch()} />}
          {sitesQuery.data && (
            <div className="grid gap-5 sm:grid-cols-2">
              {sitesQuery.data.map((site) => (
                <div key={site.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <img
                    src={site.cover_image_url}
                    alt={site.name}
                    className="aspect-video w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900">{site.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{site.location}</p>
                    {site.status === 'available' ? (
                      <Link to={`/destinations/${site.slug}`} className="mt-3 inline-block">
                        <Button variant="outline">Jelajahi</Button>
                      </Link>
                    ) : (
                      <span className="mt-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        Segera Hadir
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Cara Kerja</h2>
        <div className="mt-6 grid gap-4 text-left sm:grid-cols-2">
          {[
            'Pilih destinasi dan masuk dengan akun siswa kamu.',
            'Jelajahi panorama 360° dan navigasikan antar area.',
            'Tekan "Identifikasi" untuk mengenali objek arsitektur di depanmu.',
            'Pelajari materi geometri dan jawab kuis singkat sebelum melanjutkan.',
          ].map((step, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
              <span className="text-sm font-bold text-brand-600">Langkah {i + 1}</span>
              <p className="mt-1 text-sm text-slate-600">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Konteks Riset &amp; Pendidikan</h2>
        <p className="mt-3 text-slate-600">
          VR-GeoNusa dikembangkan sebagai bagian dari riset pembelajaran geometri berbasis VR untuk
          siswa SMP, mengukur pemahaman konsep melalui pretest, posttest, dan kuesioner
          self-efficacy.
        </p>
      </section>

      <section id="team" className="mx-auto max-w-4xl px-4 py-14 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Tim</h2>
        <p className="mt-3 text-slate-600">
          Dikembangkan oleh tim peneliti, dosen, dan mahasiswa yang berfokus pada pembelajaran
          geometri berbasis teknologi immersive.
        </p>
      </section>

      <Footer />
    </div>
  );
}
