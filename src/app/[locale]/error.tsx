"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ locale?: string }>();
  const isEnglish = params.locale === "en";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="konten-utama" className="page-content">
      <div className="shell empty-state">
        <div>
          <p className="eyebrow">{isEnglish ? "Something went wrong" : "Terjadi gangguan"}</p>
          <h2>
            {isEnglish ? "The collection cannot be displayed yet." : "Koleksi belum dapat ditampilkan."}
          </h2>
          <p>
            {isEnglish
              ? "Try loading this section again. If it still fails, return in a few moments."
              : "Coba muat ulang bagian ini. Jika tetap gagal, kembali beberapa saat lagi."}
          </p>
          <button className="button button-primary" type="button" onClick={reset}>
            {isEnglish ? "Try again" : "Coba lagi"}
          </button>
        </div>
      </div>
    </main>
  );
}
