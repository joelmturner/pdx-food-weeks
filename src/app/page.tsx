import { Inter } from "@next/font/google";
import Link from "next/link";
import Image from "../components/Image";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="flex gap-5 py-12">
      <div className="mx-auto overflow-hidden rounded-lg bg-neutral shadow flex flex-col gap-3">
        <div className="flex h-full w-full justify-center items-center">
          <Link href="/burger">
            <Image
              src="https://res.cloudinary.com/joelmturner/image/upload/v1676264377/burgerweek/portland-mercury-burger-week-logo-isolated-removebg-preview.png"
              className="w-full object-contain aspect-square"
              alt="pdx burger week logo"
              height={900}
              width={900}
            />
          </Link>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-medium text-base-content">
            <Link href="/burger">PDX Burger Week</Link>
          </h3>
          <p className="mt-1 text-neutral-content">
            Annual celebration of great burgers in Portland, Oregon.
          </p>
        </div>
      </div>
      <div className="mx-auto overflow-hidden rounded-lg bg-neutral shadow flex flex-col gap-3">
        <div className="flex h-full w-full justify-center items-center">
          <Link href="/sandwich">
            <Image
              src="https://res.cloudinary.com/joelmturner/image/upload/v1676264411/sandwichweek/portland-mercury-sandwich-week-logo-removebg-preview.png"
              className="w-full object-contain aspect-square"
              alt="pdx sandwich week logo"
              height={900}
              width={900}
            />
          </Link>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-medium text-base-content">
            <Link href="/sandwich">PDX Sandwich Week</Link>
          </h3>
          <p className="mt-1 text-neutral-content">
            Annual celebration of great sandwiches in Portland, Oregon.
          </p>
        </div>
      </div>
      <div className="mx-auto overflow-hidden rounded-lg bg-neutral shadow flex flex-col gap-3">
        <div className="flex h-full w-full justify-center items-center">
          <Link href="/nacho">
            <Image
              src="https://res.cloudinary.com/joelmturner/image/upload/v1676264340/nachoweek/portland-mercury-nacho-week-logo-isolated-removebg-preview.png"
              className="w-full object-contain aspect-square"
              alt="pdx nacho week logo"
              height={900}
              width={900}
            />
          </Link>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-medium text-base-content">
            <Link href="/nacho">PDX Nacho Week</Link>
          </h3>
          <p className="mt-1 text-neutral-content">
            Annual celebration of great nachos in Portland, Oregon.
          </p>
        </div>
      </div>
    </div>
  );
}
