import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Navigation from "@/components/Navigation";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

export default function UploadPhotoPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);

    // Create preview
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // Auto-fill title from filename
    const fileName = selectedFile.name.split(".")[0];
    setTitle(fileName.replace(/-|_/g, " "));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64File = reader.result;

        try {
          // Upload to R2 through our API with auth header
          const response = await fetch('/api/r2/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}` // Add auth token
            },
            body: JSON.stringify({
              file: base64File,
              title,
              description,
              caption,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.details || data.error || 'Upload failed');
          }

          router.push('/photos');
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          setError(uploadError instanceof Error ? uploadError.message : 'Error uploading photo');
        }
      };

      reader.onerror = () => {
        setError('Error reading file');
      };
    } catch (err) {
      console.error('Form error:', err);
      setError(err instanceof Error ? err.message : 'Error uploading photo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation user={user} onLogout={handleLogout} />
      <div className="container mx-auto pt-16 p-4">
        <h1 className="text-2xl font-bold mb-6">Upload New Photo</h1>
        <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto">
          <div
            {...getRootProps()}
            className={`mb-6 border-2 border-dashed rounded-lg text-center cursor-pointer min-h-[250px] flex items-center justify-center
              ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
              ${preview ? "p-4" : "p-8"}`}
          >
            <input {...getInputProps()} />

            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div>
                {isDragActive ? (
                  <p className="text-blue-500">Drop the photo here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600">
                      Drag and drop a photo here, or click to select
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Supports: JPG, PNG, GIF
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mb-4">
            {/* <label className="block text-gray-700 mb-2 text-center">
              Title
            </label> */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded text-center text-gray-900 placeholder-gray-400"
              placeholder="Enter a title for your photo"
              required
            />
          </div>

          <div className="mb-4">
            {/* <label className="block text-gray-700 mb-2 text-center">
              Description
            </label> */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded text-center text-gray-900 placeholder-gray-400"
              placeholder="Enter a description for your photo"
              rows={3}
            />
          </div>

          <div className="mb-4">
            {/* <label className="block text-gray-700 mb-2 text-center">
              Caption
            </label> */}
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-2 border rounded text-center text-gray-900 placeholder-gray-400"
              placeholder="Enter a caption for your photo"
            />
          </div>

          {error && (
            <div className="text-red-500 mb-4 text-center">{error}</div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading || !file}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? "Uploading..." : "Upload Photo"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
