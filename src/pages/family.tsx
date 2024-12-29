import { useEffect, useState } from "react";
import { FamilyMembers, Person } from "@/types/family";
import { supabase } from "@/lib/supabaseClient";

export default function FamilyPage() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMembers>({
    parents: [],
    children: [],
    siblings: [],
    grandparents: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          throw new Error("No active session");
        }

        const response = await fetch("/api/family", {
          headers: {
            Authorization: `Bearer ${sessionData.session.access_token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch family members");
        }
        
        const data = await response.json();
        setFamilyMembers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyMembers();
  }, []);

  if (loading) {
    return <div>Loading family members...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const renderPersonList = (people: Person[], relationship: string) => {
    if (people.length === 0) {
      return <p>No {relationship} found</p>;
    }

    return (
      <ul>
        {people.map((person) => (
          <li key={person.id}>
            {person.name} (Born:{" "}
            {new Date(person.birth_date).toLocaleDateString()})
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Family Members</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">Parents</h2>
          {renderPersonList(familyMembers.parents, "parents")}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Children</h2>
          {renderPersonList(familyMembers.children, "children")}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Siblings</h2>
          {renderPersonList(familyMembers.siblings, "siblings")}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Grandparents</h2>
          {renderPersonList(familyMembers.grandparents, "grandparents")}
        </section>
      </div>
    </div>
  );
}
