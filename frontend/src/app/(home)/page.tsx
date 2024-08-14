import Image from "next/image";
import DisplayMovies from "./components/DisplayMovies";

export default function Home() {
  return (
    <main className="px-12">
      <DisplayMovies />
    </main>
  );
}
