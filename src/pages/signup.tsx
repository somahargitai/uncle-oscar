import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 rounded-lg">
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
          Sign Up
        </h2>
        <div className="mt-8 space-y-6">
          <p className="text-lg text-gray-600 text-center">
            To register for an account, please contact the administrator. They
            will help you set up your family profile and provide you with login
            credentials.
          </p>
          <div className="text-center text-sm text-gray-600 mt-4">
            <Link href="/" className="hover:text-gray-900 mr-4">
              Back to Home
            </Link>
            <span>•</span>
            <Link href="/login" className="hover:text-gray-900 ml-4">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
