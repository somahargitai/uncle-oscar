import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

import { Upload, Users, FileText, BookOpen } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "auto", textAlign: "center" }}>
      {user ? (
        <>
          <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">
              Welcome to Your Family Archive
            </h1>
            <div className="flex items-center justify-between p-4 border rounded-lg mb-4 max-w-md mx-auto">
              <p>user: {user.email}!</p>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
              >
                Logout
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Start preserving your family memories by uploading photos,
              documents, and stories.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <Link href="/upload/photo">
                <Card className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Upload className="w-12 h-12 text-blue-500" />
                    <h2 className="text-xl font-semibold">Upload Photos</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Share your family photos and memories
                    </p>
                  </div>
                </Card>
              </Link>

              <Link href="/family/new">
                <Card className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Users className="w-12 h-12 text-green-500" />
                    <h2 className="text-xl font-semibold">Add Family Member</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add new members to your family tree
                    </p>
                  </div>
                </Card>
              </Link>

              <Link href="/upload/document">
                <Card className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <FileText className="w-12 h-12 text-yellow-500" />
                    <h2 className="text-xl font-semibold">Upload Documents</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Preserve important family documents
                    </p>
                  </div>
                </Card>
              </Link>

              <Link href="/stories/new">
                <Card className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <BookOpen className="w-12 h-12 text-purple-500" />
                    <h2 className="text-xl font-semibold">Add Story</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Share your family stories and history
                    </p>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
}
