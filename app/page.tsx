import Image from "next/image";
import { Caveat } from 'next/font/google';

const caveat = Caveat({ subsets: ['latin'], display: 'swap' });

export default function Home() {
  return (
    <main className="relative h-screen w-full">
      <Image
        src="/top_toyota_stadium.jpeg"
        alt="top_image"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30">
        <h1 className={'text-[#FFD700] text-6xl shadow-lg text-left ${caveat.className}'}>
          Never Give Up for the Win
        </h1>
      </div>
    </main>
  );
}