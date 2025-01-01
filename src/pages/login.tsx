import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8  rounded-lg ">
        <div className="flex justify-center">
          <Image
            className="dark:invert"
            src="/uncle-oscar-drawn.svg"
            alt="Uncle Oscar logo"
            width={180}
            height={180}
            priority
          />
        </div>

        <h2 className="text-center text-3xl font-bold text-gray-900 mt-2">
          Sign in
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input
            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: "block", width: "100%", marginBottom: "10px" }}
            required
          />
          <input
            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: "block", width: "100%", marginBottom: "10px" }}
            required
          />
          <button
            className="w-full
            rounded-full border border-solid
             border-transparent transition-colors
              flex items-center justify-center bg-foreground text-background gap-2
             hover:bg-[#383838]
             dark:hover:bg-[#ccc] 
             bg-slate-900
             
             text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            type="submit"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-center text-sm text-gray-600 mt-4">
          <Link href="/" className="hover:text-gray-900 mr-4">
            Back to Home
          </Link>
          <span>•</span>
          <Link href="/signup" className="hover:text-gray-900 ml-4">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
