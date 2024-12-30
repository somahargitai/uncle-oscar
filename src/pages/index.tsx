import Image from "next/image";
import Navigation from "@/components/Navigation";

export default function Home() {
  return (
    <>
      <Navigation transparent />
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          {/* TODO: There should be an animation here about a walking uncle oscar */}
          <h1 className="flex flex-col gap-2 sm:gap-0 text-6xl font-bold text-center sm:text-left">
            <span className="text-xl text-gray-600 text-center sm:text-left mb-4">Welcome to</span>
            <span className="text-6xl sm:hidden">Uncle Oscar</span>
            <span className="hidden sm:block">Welcome to Uncle Oscar</span>
          </h1>
          <p className="text-xl text-gray-600 text-center sm:text-left">
            Share photos, stories, family history, and more
          </p>
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
      </div>
    </>
  );
}
