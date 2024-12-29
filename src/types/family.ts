export interface FamilyMembers {
  parents: Person[];
  children: Person[];
  siblings: Person[];
  grandparents: Person[];
}
export interface Person {
  id: string;
  name: string;
  birth_date: string;
  created_at: string;
  user_id?: string; // Reference to Supabase auth.users
}

export interface Relationship {
  id: string;
  person1_id: string;
  person2_id: string;
  relationship_type: "parent" | "child" | "sibling";
  created_at: string;
}
