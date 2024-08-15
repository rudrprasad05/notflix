"use server";

import axios from "axios";

export async function GetAllMovies() {
  const res = await axios.get(`http://localhost:3001/api/movies`);

  return res;
}
