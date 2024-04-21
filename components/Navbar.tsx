import Link from "next/link";
import React from "react";

const links = [
  {
    title: "create",
    link: "/create",
  },
  {
    title: "chat",
    link: "/chat",
  },
];

export default function Navbar() {
  return (
    <nav className="bg-transparent flex justify-between p-3">
      <div>Navbar</div>
      <div className="space-x-3">
        {links.map((link, i) => (
          <Link key={i} href={link.link}>
            {link.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}
