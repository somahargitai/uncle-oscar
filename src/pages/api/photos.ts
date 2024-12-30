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
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return res.status(500).json({ message: "Error fetching photos" });
  }
}
