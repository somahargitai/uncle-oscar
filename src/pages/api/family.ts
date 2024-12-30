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
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get the auth header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Missing auth header" });
    }
    // Get user from the token
    const {
      data: { user },
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // First get the person record associated with the authenticated user
    const { data: personRecord, error: personError } = await supabase
      .from("persons")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (personError || !personRecord) {
      return res.status(404).json({ error: "Person record not found" });
    }

    const personId = personRecord.id;

    // Get parents - map to match Person interface
    const { data: parents } = await supabase
      .from("relationships")
      .select("*, persons!relationships_person1_id_fkey(*)")
      .eq("person2_id", personId)
      .eq("relationship_type", "parent");

    // Get siblings
    const { data: siblings } = await supabase
      .from("relationships")
      .select("*, persons!relationships_person2_id_fkey(*)")
      .eq("relationship_type", "sibling")
      .eq("person1_id", personId);

    // Get children - map to match Person interface
    const { data: children } = await supabase
      .from("relationships")
      .select("*, persons!relationships_person2_id_fkey(*)")
      .eq("person1_id", personId)
      .eq("relationship_type", "parent");

    // Get grandparents
    const { data: grandparents } = await supabase.rpc("get_grandparents", {
      user_id: personId,
    });

    // Transform the data to match the Person interface
    return res.status(200).json({
      parents: parents?.map((rel) => rel.persons) || [],
      children: children?.map((rel) => rel.persons) || [],
      siblings: siblings?.map((rel) => rel.persons) || [],
      grandparents: grandparents || [],
    });
  } catch (error) {
    console.error("Error fetching family members:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
