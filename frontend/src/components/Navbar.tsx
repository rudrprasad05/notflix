import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full">
      <ul className="flex gap-6 px-12 py-4 items-center">
        <li className="text-2xl mr-10 uppercase font-extrabold text-rose-600">
          Notflix
        </li>
        <li>Home</li>
        <li>Movies</li>
        <li>Shows</li>
        <Link href={"/admin"}>
          <li className={""}>Admin</li>
        </Link>
      </ul>
    </nav>
  );
};

export default Navbar;
