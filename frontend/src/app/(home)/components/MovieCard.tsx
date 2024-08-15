import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface MovieProps {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  image: string;
  duration: number;
  url: string;
}

const MovieCard = ({ movie }: { movie: MovieProps }) => {
  return (
    <Link href={`/movies/${movie.url}`}>
      <div className="rounded-xl border border-solid">
        <div>
          <Image
            className="w-full h-48 rounded-t-lg"
            src={movie.image}
            alt=""
            height={300}
            width={500}
          />
        </div>
        <div className="p-6">
          <h1>{movie.name}</h1>
          <p className="text-slate-400">{movie.duration} minutes</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
