import Image from "next/image";

export function Loader() {
  return (
    <div className="w-full h-full flex justify-center items-center min-h-screen">
      <div className="animate-spin">
        <Image
          src="/uncle-oscar-small-logo.svg"
          alt="Loading..."
          width={160}
          height={160}
          className="invert"
        />
      </div>
    </div>
  );
}
