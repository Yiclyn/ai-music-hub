-- Create posts table
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  media_url text not null,
  media_type text not null check (media_type in ('audio', 'video')),
  cover_url text,
  author_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create comments table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  content text not null,
  author_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create likes table
create table public.likes (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (post_id, user_id)
);

-- Disable RLS for testing, or write proper policies if user login is added. Since the user didn't mention auth, we make it simple
alter table public.posts disable row level security;
alter table public.comments disable row level security;
alter table public.likes disable row level security;

-- Enable real-time
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.comments;
alter publication supabase_realtime add table public.likes;

-- Set up Storage for media
insert into storage.buckets (id, name, public) values ('media', 'media', true)
on conflict (id) do nothing;

create policy "Public access to media bucket." 
on storage.objects for select 
using ( bucket_id = 'media' );

create policy "Public insert to media bucket." 
on storage.objects for insert 
with check ( bucket_id = 'media' );
