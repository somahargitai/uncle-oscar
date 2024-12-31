import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get auth token from request header
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    // Create authenticated client if token exists
    const client = token ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    ) : supabase;

    const { data, error } = await client
      .from("photos")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return res.status(200).json(data || []);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return res.status(500).json({ message: "Error fetching photos" });
  }
}
