import Image from "next/image";

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
        <h1 className="text-white text-5xl font-bold tracking-widest text-center shadow-lg">
          Never Give Up for the Win<br />Challenge for the Top<br />Open mind for the Grampus Family
        </h1>
      </div>
    </main>
  );
}