import Image from "next/image";
import UploadMovies from "./components/UploadMovies";

export default function Home() {
  return (
    <main className="px-12">
      <UploadMovies />
    </main>
  );
}
