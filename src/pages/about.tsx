import Image from "next/image";
import Navigation from "@/components/Navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

export default function About() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      <Navigation user={user} onLogout={handleLogout} />
      <div className="max-w-4xl mx-auto p-8 pt-36">
        <h1 className="text-4xl font-bold mb-8">About Uncle Oscar</h1>

        <div className="prose prose-lg mb-12">
          <p className="mb-4">
            Uncle Oscar is a modern family photo sharing web application built
            with cutting-edge technologies to provide a seamless and secure
            experience for families to preserve and share their memories.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Technical Stack</h2>

          <ul className="list-disc pl-6 mb-8">
            <li>Next.js 14 for server-side rendering and optimal performance</li>
            <li>TypeScript for type-safe development</li>
            <li>Supabase for secure photo storage and database management</li>
            <li>Tailwind CSS for modern, responsive styling</li>
            <li>React Dropzone for intuitive file uploads</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Key Features</h2>

          <ul className="list-disc pl-6 mb-8">
            <li>Secure photo upload and storage</li>
            <li>Responsive photo gallery with optimized loading</li>
            <li>User authentication and authorization</li>
            <li>Family tree visualization</li>
            <li>Photo descriptions and captions</li>
          </ul>
        </div>

        <h2 className="text-2xl font-semibold mb-6">
          Learn More About Our Tech Stack
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Learn Next.js
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            View Examples
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            Deploy on Vercel
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Read Documentation
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Visit Next.js Website
          </a>
        </div>
      </div>
    </>
  );
}
