import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Photo } from "@/types/photo";
import { supabase } from "@/lib/supabaseClient";
import Navigation from "@/components/Navigation";
import { User } from "@supabase/supabase-js";

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
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

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch("/api/photos");
        if (!response.ok) {
          throw new Error("Failed to fetch photos");
        }
        const data = await response.json();
        setPhotos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching photos");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) {
    return <div className="pt-16 p-4">Loading...</div>;
  }

  if (error) {
    return <div className="pt-16 p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <Navigation user={user} onLogout={handleLogout} />
      <div className="container mx-auto pt-16 p-4">
        <h1 className="text-2xl font-bold mb-6">Photos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-48">
                <Image
                  src={photo.url}
                  alt={photo.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{photo.title}</h2>
                {photo.description && (
                  <p className="text-gray-600 mb-2">{photo.description}</p>
                )}
                {photo.caption && (
                  <p className="text-sm text-gray-500">{photo.caption}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(photo.uploaded_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
