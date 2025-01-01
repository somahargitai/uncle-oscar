-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create persons table
create table if not exists public.persons (
    id uuid primary key default uuid_generate_v4(),
    name varchar(255) not null,
    birth_date date not null,
    created_at timestamptz default CURRENT_TIMESTAMP,
    user_id uuid references public.users(id)
);

-- Create photos table
create table if not exists public.photos (
    id uuid primary key default uuid_generate_v4(),
    title varchar not null,
    description text,
    url varchar not null,
    caption text,
    uploaded_at timestamptz default CURRENT_TIMESTAMP,
    user_id uuid not null references public.users(id)
);

-- Create relationships table
create table if not exists public.relationships (
    id uuid primary key default uuid_generate_v4(),
    person1_id uuid not null references public.persons(id),
    person2_id uuid not null references public.persons(id),
    relationship_type varchar(20),
    created_at timestamptz default CURRENT_TIMESTAMP
);

-- Create indexes
create index if not exists idx_persons_user_id on public.persons (user_id);
create index if not exists idx_relationships_person1 on public.relationships (person1_id);
create index if not exists idx_relationships_person2 on public.relationships (person2_id);

-- Create functions
create or replace function public.get_grandparents(user_id uuid)
returns table(
    id uuid,
    name varchar,
    birth_date date,
    created_at timestamptz
)
language plpgsql
as $$
begin
    return query
    select distinct p.*
    from persons p
    inner join relationships r1 on p.id = r1.person1_id
    inner join relationships r2 on r1.person2_id = r2.person1_id
    where r2.person2_id = user_id
    and r1.relationship_type = 'parent'
    and r2.relationship_type = 'parent';
end;
$$; 