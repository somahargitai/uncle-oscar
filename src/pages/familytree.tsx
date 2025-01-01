import { useEffect, useState } from "react";
import { FamilyMembers, Person } from "@/types/family";
import { supabase } from "@/lib/supabaseClient";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/router";
import { User } from "@supabase/supabase-js";
import { Loader } from "@/components/ui/loader";

export default function FamilyPage() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMembers>({
    parents: [],
    children: [],
    siblings: [],
    grandparents: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    return <Loader />;
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
    <>
      <Navigation user={user} onLogout={handleLogout} />
      <div className="container mx-auto pt-16 p-4">
        <h1 className="text-2xl font-bold mb-6">Family </h1>

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
    </>
  );
}
