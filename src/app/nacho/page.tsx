import Link from "next/link";

export default function NachoPage() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="">
        <Link href="/nacho/2019">2019</Link>
      </div>
      <div className="">
        <Link href="/nacho/2023">2023</Link>
      </div>
    </div>
  );
}
