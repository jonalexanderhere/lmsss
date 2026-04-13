create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type app_role as enum ('admin', 'teacher', 'student');
  end if;

  if not exists (select 1 from pg_type where typname = 'course_category') then
    create type course_category as enum ('Networking', 'Cybersecurity', 'System Administration');
  end if;

  if not exists (select 1 from pg_type where typname = 'lesson_type') then
    create type lesson_type as enum ('text', 'video', 'lab');
  end if;
end
$$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role app_role not null default 'student',
  avatar_url text,
  xp integer not null default 0,
  rank text not null default 'Trainee',
  grade text check (grade in ('X', 'XI', 'XII', 'Graduated')),
  class_name text,
  status text not null default 'active' check (status in ('active', 'inactive', 'graduated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category course_category not null,
  overview text,
  cover_url text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  type lesson_type not null,
  content text not null,
  video_url text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete cascade,
  title text not null,
  timer_in_minutes integer not null default 15,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  prompt text not null,
  options jsonb not null,
  correct_answer text not null,
  explanation text,
  difficulty text default 'medium',
  created_at timestamptz not null default now()
);

create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  score integer not null check (score between 0 and 100),
  duration integer not null default 0,
  mistakes jsonb not null default '[]'::jsonb,
  xp_earned integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_analysis (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  result_id uuid not null references public.results(id) on delete cascade,
  level text not null,
  feedback text not null,
  weakness text,
  next_step text,
  created_at timestamptz not null default now()
);

create table if not exists public.practice_lab_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  command_history jsonb not null default '[]'::jsonb,
  score integer not null default 0,
  scenario text not null,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.results enable row level security;
alter table public.ai_analysis enable row level security;
alter table public.practice_lab_runs enable row level security;

drop policy if exists "users_select_self_or_admin" on public.users;
create policy "users_select_self_or_admin" on public.users
for select using (auth.uid() = id or exists (
  select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'
));

drop policy if exists "users_update_self_or_admin" on public.users;
create policy "users_update_self_or_admin" on public.users
for update using (auth.uid() = id or exists (
  select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'
));

drop policy if exists "courses_read_all_authenticated" on public.courses;
create policy "courses_read_all_authenticated" on public.courses
for select using (auth.role() = 'authenticated');

drop policy if exists "lessons_read_all_authenticated" on public.lessons;
create policy "lessons_read_all_authenticated" on public.lessons
for select using (auth.role() = 'authenticated');

drop policy if exists "quizzes_read_all_authenticated" on public.quizzes;
create policy "quizzes_read_all_authenticated" on public.quizzes
for select using (auth.role() = 'authenticated');

drop policy if exists "quiz_questions_read_all_authenticated" on public.quiz_questions;
create policy "quiz_questions_read_all_authenticated" on public.quiz_questions
for select using (auth.role() = 'authenticated');

drop policy if exists "results_select_self_or_teacher_admin" on public.results;
create policy "results_select_self_or_teacher_admin" on public.results
for select using (
  auth.uid() = user_id
  or exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('teacher', 'admin'))
);

drop policy if exists "results_insert_self" on public.results;
create policy "results_insert_self" on public.results
for insert with check (auth.uid() = user_id);

drop policy if exists "ai_analysis_select_self_or_teacher_admin" on public.ai_analysis;
create policy "ai_analysis_select_self_or_teacher_admin" on public.ai_analysis
for select using (
  auth.uid() = user_id
  or exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('teacher', 'admin'))
);

drop policy if exists "lab_runs_select_self_or_teacher_admin" on public.practice_lab_runs;
create policy "lab_runs_select_self_or_teacher_admin" on public.practice_lab_runs
for select using (
  auth.uid() = user_id
  or exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('teacher', 'admin'))
);

drop policy if exists "lab_runs_insert_self" on public.practice_lab_runs;
create policy "lab_runs_insert_self" on public.practice_lab_runs
for insert with check (auth.uid() = user_id);

-- Teacher Management Policies
drop policy if exists "courses_manage_teacher_admin" on public.courses;
create policy "courses_manage_teacher_admin" on public.courses
for all using (exists (
  select 1 from public.users u where u.id = auth.uid() and u.role in ('teacher', 'admin')
));

drop policy if exists "lessons_manage_teacher_admin" on public.lessons;
create policy "lessons_manage_teacher_admin" on public.lessons
for all using (exists (
  select 1 from public.users u where u.id = auth.uid() and u.role in ('teacher', 'admin')
));

drop policy if exists "quizzes_manage_teacher_admin" on public.quizzes;
create policy "quizzes_manage_teacher_admin" on public.quizzes
for all using (exists (
  select 1 from public.users u where u.id = auth.uid() and u.role in ('teacher', 'admin')
));

drop policy if exists "quiz_questions_manage_teacher_admin" on public.quiz_questions;
create policy "quiz_questions_manage_teacher_admin" on public.quiz_questions
for all using (exists (
  select 1 from public.users u where u.id = auth.uid() and u.role in ('teacher', 'admin')
));

drop policy if exists "users_teacher_manage_students" on public.users;
create policy "users_teacher_manage_students" on public.users
for update using (exists (
  select 1 from public.users u where u.id = auth.uid() and u.role in ('teacher', 'admin')
));

insert into storage.buckets (id, name, public)
values ('course-assets', 'course-assets', false)
on conflict (id) do nothing;

insert into public.courses (slug, title, category, overview)
values
  ('advanced-networking-fundamentals', 'Advanced Networking Fundamentals', 'Networking', 'Routing, subnetting, VLAN, dan troubleshooting jaringan inti.'),
  ('defensive-cybersecurity-basics', 'Defensive Cybersecurity Basics', 'Cybersecurity', 'Blue team fundamentals, hardening, monitoring, dan analisis log.'),
  ('linux-server-administration', 'Linux Server Administration', 'System Administration', 'Linux service management, deployment dasar, dan maintenance server.')
on conflict (slug) do nothing;

insert into public.lessons (course_id, title, type, content, order_index)
select c.id, 'IP Addressing Architecture', 'text', 'Konsep address classless, subnet mask, gateway, dan desain segmentasi jaringan.', 1
from public.courses c
where c.slug = 'advanced-networking-fundamentals'
and not exists (
  select 1 from public.lessons l where l.course_id = c.id and l.title = 'IP Addressing Architecture'
);

insert into public.lessons (course_id, title, type, content, order_index)
select c.id, 'CIDR and VLSM Walkthrough', 'video', 'Video pembahasan CIDR, VLSM, dan efisiensi alokasi alamat IP.', 2
from public.courses c
where c.slug = 'advanced-networking-fundamentals'
and not exists (
  select 1 from public.lessons l where l.course_id = c.id and l.title = 'CIDR and VLSM Walkthrough'
);

insert into public.lessons (course_id, title, type, content, order_index)
select c.id, 'Lab: Router-on-a-Stick Setup', 'lab', 'Instruksi praktikum inter-VLAN routing menggunakan router-on-a-stick.', 3
from public.courses c
where c.slug = 'advanced-networking-fundamentals'
and not exists (
  select 1 from public.lessons l where l.course_id = c.id and l.title = 'Lab: Router-on-a-Stick Setup'
);

insert into public.quizzes (lesson_id, title, timer_in_minutes)
select l.id, 'Subnetting Drill', 15
from public.lessons l
where l.title = 'CIDR and VLSM Walkthrough'
and not exists (
  select 1 from public.quizzes q where q.lesson_id = l.id and q.title = 'Subnetting Drill'
);

insert into public.quiz_questions (quiz_id, prompt, options, correct_answer, explanation, difficulty)
select q.id,
  'Berapa jumlah host usable untuk subnet /27?',
  '["30", "32", "62", "14"]'::jsonb,
  '30',
  'Subnet /27 memiliki 32 alamat total dengan 30 host usable.',
  'medium'
from public.quizzes q
where q.title = 'Subnetting Drill'
and not exists (
  select 1 from public.quiz_questions qq
  where qq.quiz_id = q.id and qq.prompt = 'Berapa jumlah host usable untuk subnet /27?'
);

insert into public.quiz_questions (quiz_id, prompt, options, correct_answer, explanation, difficulty)
select q.id,
  'Protocol mana yang termasuk dynamic routing?',
  '["STP", "RIP", "NAT", "ARP"]'::jsonb,
  'RIP',
  'RIP adalah dynamic routing protocol yang umum dipakai pada topologi sederhana.',
  'easy'
from public.quizzes q
where q.title = 'Subnetting Drill'
and not exists (
  select 1 from public.quiz_questions qq
  where qq.quiz_id = q.id and qq.prompt = 'Protocol mana yang termasuk dynamic routing?'
);
