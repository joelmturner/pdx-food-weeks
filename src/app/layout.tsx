import Link from "next/link";
import FilterProvider from "./filterProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-base-300" data-theme="dracula">
      <head />
      <body className="bg-base-300">
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <Link href="/" className="btn btn-ghost normal-case text-xl">
              PDX Food Week
            </Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link href="/burger">Burgers</Link>
              </li>
              <li>
                <Link href="/nacho">Nachos</Link>
              </li>
              <li>
                <Link href="/sandwich">Sandwiches</Link>
              </li>
            </ul>
          </div>
        </div>
        <FilterProvider>{children}</FilterProvider>
      </body>
    </html>
  );
}
