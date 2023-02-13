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
              PDX Food Weeks
            </Link>
          </div>
          <div className="flex-none hidden lg:flex">
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
          <div className="navbar-end lg:hidden">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              >
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
        </div>
        <FilterProvider>{children}</FilterProvider>
      </body>
    </html>
  );
}
