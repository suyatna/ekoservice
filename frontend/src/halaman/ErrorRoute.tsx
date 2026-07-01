import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export const HalamanErrorRoute = () => {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 404;
  const pesan =
    status === 401 || status === 403
      ? 'Kamu tidak punya akses ke halaman ini'
      : 'Halaman tidak tersedia';

  return (
    <main className="min-h-screen bg-latar px-5 py-8 text-teks">
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-center">
        <p
          className="text-sm text-teks2"
          style={{ fontFamily: "'Farro', sans-serif", textTransform: 'none' }}
        >
          {pesan}
        </p>
      </div>
    </main>
  );
};
