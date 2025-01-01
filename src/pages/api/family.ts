import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";

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

    // Create authenticated client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader
          }
        }
      }
    );

    // Get user from the token
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // First get the person record associated with the authenticated user
    const { data: personRecord, error: personError } = await supabase
      .from("persons")
      .select("*")
      .eq("id", user.id)  // Changed from user_id to id since we're using auth.users ids
      .single();

    if (personError || !personRecord) {
      console.error("Person error:", personError);
      return res.status(404).json({ error: "Person record not found" });
    }

    // Get parents
    const { data: parents, error: parentsError } = await supabase
      .from("relationships")
      .select(`
        person1:persons!relationships_person1_id_fkey (*)
      `)
      .eq("person2_id", user.id)
      .eq("relationship_type", "parent");

    if (parentsError) console.error("Parents error:", parentsError);

    // Get siblings (people who share the same parents)
    const { data: siblings, error: siblingsError } = await supabase
      .from("persons")
      .select("*")
      .neq("id", user.id)
      .in("id", (
        await supabase
          .from("relationships")
          .select("person2_id")
          .eq("person1_id", parents?.[0]?.person1.id)
          .eq("relationship_type", "parent")
      ).data?.map(r => r.person2_id) || []);

    if (siblingsError) console.error("Siblings error:", siblingsError);

    // Get children
    const { data: children, error: childrenError } = await supabase
      .from("relationships")
      .select(`
        person2:persons!relationships_person2_id_fkey (*)
      `)
      .eq("person1_id", user.id)
      .eq("relationship_type", "parent");

    if (childrenError) console.error("Children error:", childrenError);

    // Get grandparents
    const { data: grandparents, error: grandparentsError } = await supabase
      .rpc("get_grandparents", {
        person_id: user.id
      });

    if (grandparentsError) console.error("Grandparents error:", grandparentsError);

    return res.status(200).json({
      person: personRecord,
      parents: parents?.map(rel => rel.person1) || [],
      siblings: siblings || [],
      children: children?.map(rel => rel.person2) || [],
      grandparents: grandparents || []
    });

  } catch (error) {
    console.error("Error fetching family members:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
