-- 1) EXTENSIONS
create extension if not exists "pgcrypto";

-- 2) TABLES

-- A) profiles
create table public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    full_name text,
    role text check (role in ('admin', 'customer')) default 'customer',
    created_at timestamptz default now()
);

-- B) categories
create table public.categories (
    id uuid primary key default gen_random_uuid (),
    name text unique not null,
    slug text unique not null,
    created_at timestamptz default now()
);

-- C) products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  currency text default 'GEL',
  age_min integer,
  age_max integer,
  category_id uuid references categories(id) on delete set null,
  stock integer default 0,
  is_active boolean default true,
  image_urls text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3) TRIGGERS
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_products_updated
  before update on public.products
  for each row execute procedure public.handle_updated_at();

-- A) profiles trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'customer');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4) RLS ENABLE
alter table public.profiles enable row level security;

alter table public.categories enable row level security;

alter table public.products enable row level security;

-- 5) HELPER FUNCTION
create or replace function public.is_admin(uid uuid)
returns boolean
security definer
set search_path = public
stable
as $$
declare
  is_admin boolean;
begin
  select (role = 'admin') into is_admin
  from profiles
  where id = uid;
  return coalesce(is_admin, false);
end;
$$ language plpgsql;

-- 6) POLICIES

-- A) profiles policies
create policy "Users can insert their own profile" on public.profiles for
insert
with
    check (auth.uid () = id);

create policy "Users can view their own profile" on public.profiles for
select using (auth.uid () = id);

create policy "Users can update their own profile" on public.profiles for
update using (auth.uid () = id);

-- B) categories policies
create policy "Categories are viewable by everyone" on public.categories for
select using (true);

create policy "Admins can insert categories" on public.categories for
insert
with
    check (is_admin (auth.uid ()));

create policy "Admins can update categories" on public.categories for
update using (is_admin (auth.uid ()));

create policy "Admins can delete categories" on public.categories for delete using (is_admin (auth.uid ()));

-- C) products policies
create policy "Active products are viewable by everyone" on public.products for
select using (
        is_active = true
        or is_admin (auth.uid ())
    );

create policy "Admins can insert products" on public.products for
insert
with
    check (is_admin (auth.uid ()));

create policy "Admins can update products" on public.products for
update using (is_admin (auth.uid ()));

create policy "Admins can delete products" on public.products for delete using (is_admin (auth.uid ()));

-- 7) STORAGE SETUP
insert into
    storage.buckets (id, name, public)
values (
        'product-images',
        'product-images',
        true
    ) on conflict (id) do nothing;

create policy "Public Access to Product Images" on storage.objects for
select using (bucket_id = 'product-images');

create policy "Admins can upload product images" on storage.objects for
insert
with
    check (
        bucket_id = 'product-images'
        and is_admin (auth.uid ())
    );

create policy "Admins can update product images" on storage.objects for
update using (
    bucket_id = 'product-images'
    and is_admin (auth.uid ())
);

create policy "Admins can delete product images" on storage.objects for delete using (
    bucket_id = 'product-images'
    and is_admin (auth.uid ())
);

-- 8) SEED DATA

-- Categories
insert into
    public.categories (name, slug)
values ('Educational', 'educational'),
    ('RC & Robots', 'rc-robots'),
    ('Dolls & Plush', 'dolls'),
    ('Puzzles', 'puzzles'),
    ('Outdoor Fun', 'outdoor'),
    ('Board Games', 'board-games') on conflict (slug) do nothing;

-- Products (Example Toys)
-- We need to look up category IDs, so we use a DO block or CTE.
-- For simplicity in a seed script, we can use subqueries.

insert into
    public.products (
        title,
        slug,
        description,
        price_cents,
        category_id,
        stock,
        is_active,
        age_min,
        age_max,
        image_urls
    )
values
    -- Educational
    (
        'Solar System Model',
        'solar-system-model',
        'Build your own glow-in-the-dark solar system.',
        4500,
        (
            select id
            from categories
            where
                slug = 'educational'
        ),
        20,
        true,
        8,
        99,
        '{}'
    ),
    (
        'Mega Block Builder',
        'mega-block-builder',
        '100 colorful blocks for creativity.',
        2999,
        (
            select id
            from categories
            where
                slug = 'educational'
        ),
        50,
        true,
        3,
        5,
        '{}'
    ),

-- RC & Robots
(
    'Space Explorer Rocket',
    'space-explorer-rocket',
    'Blast off into adventure!',
    4999,
    (
        select id
        from categories
        where
            slug = 'rc-robots'
    ),
    15,
    true,
    3,
    5,
    '{}'
),
(
    'Robot Companion',
    'robot-companion',
    'Programmable robot friend.',
    8999,
    (
        select id
        from categories
        where
            slug = 'rc-robots'
    ),
    10,
    true,
    5,
    8,
    '{}'
),
(
    'Remote Control Car',
    'remote-control-car',
    'High speed racer.',
    5999,
    (
        select id
        from categories
        where
            slug = 'rc-robots'
    ),
    25,
    true,
    8,
    99,
    '{}'
),

-- Dolls & Plush
(
    'Cuddly Bear',
    'cuddly-bear',
    'Softest huggable bear.',
    1999,
    (
        select id
        from categories
        where
            slug = 'dolls'
    ),
    100,
    true,
    0,
    99,
    '{}'
),

-- Puzzles
(
    'Wooden Puzzle Set',
    'wooden-puzzle-set',
    'Sustainably sourced wooden puzzles.',
    2499,
    (
        select id
        from categories
        where
            slug = 'puzzles'
    ),
    30,
    true,
    1,
    3,
    '{}'
),

-- Outdoor
(
    'Super Soaker',
    'super-soaker',
    'Ultimate water blaster.',
    1500,
    (
        select id
        from categories
        where
            slug = 'outdoor'
    ),
    40,
    true,
    5,
    99,
    '{}'
),
(
    'Kite Flyer',
    'kite-flyer',
    'Easy to fly dragon kite.',
    1200,
    (
        select id
        from categories
        where
            slug = 'outdoor'
    ),
    60,
    true,
    4,
    99,
    '{}'
),

-- Board Games
(
    'Family Board Game',
    'family-board-game',
    'Strategy and luck for the family.',
    3999,
    (
        select id
        from categories
        where
            slug = 'board-games'
    ),
    45,
    true,
    8,
    99,
    '{}'
),
(
    'Chess Set',
    'chess-set',
    'Classic wooden chess set.',
    3500,
    (
        select id
        from categories
        where
            slug = 'board-games'
    ),
    20,
    true,
    6,
    99,
    '{}'
),
(
    'Monopoly Georgian Edition',
    'monopoly-ge',
    'Classic trading game with local streets.',
    5500,
    (
        select id
        from categories
        where
            slug = 'board-games'
    ),
    30,
    true,
    8,
    99,
    '{}'
) on conflict (slug) do nothing;

-- 9) SAFE ADMIN PROMOTION INSTRUCTIONS
/*
HOW TO PROMOTE A USER TO ADMIN:

1. User must sign up via the application first.
2. Go to Authentication -> Users in Supabase Dashboard to find their UUID.
3. Run the following SQL:

UPDATE public.profiles
SET role = 'admin'
WHERE id = 'THE_USER_UUID_HERE';

*/