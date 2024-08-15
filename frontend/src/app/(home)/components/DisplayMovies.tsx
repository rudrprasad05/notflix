import { GetAllMovies } from "@/actions/Movies";
import React from "react";
import MovieCard, { MovieProps } from "./MovieCard";

export default async function DisplayMovies() {
  const res = await GetAllMovies();

  return (
    <div className="my-5">
      <h1 className="text-xl">Trending Now</h1>
      <main className="flex gap-8 flex-wrap my-6">
        {res.data.map((d: MovieProps) => (
          <MovieCard key={d.id} movie={d} />
        ))}
      </main>
    </div>
  );
}
