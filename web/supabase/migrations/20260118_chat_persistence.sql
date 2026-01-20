-- CHAT SESSIONS (Conversations)
create table if not exists chat_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  title text default 'New Chat',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- CHAT MESSAGES (Individual Bubbles)
create table if not exists chat_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references chat_sessions(id) on delete cascade not null,
  role text check (role in ('user', 'assistant')),
  content text not null,
  widget_data jsonb, -- Stores the widget payload (e.g., generated workout)
  created_at timestamp with time zone default now()
);

-- Indexes for performance
create index if not exists idx_chat_sessions_user on chat_sessions(user_id);
create index if not exists idx_chat_messages_session on chat_messages(session_id);

-- RLS for Chat Sessions
alter table chat_sessions enable row level security;

create policy "Users can view their own chat sessions."
  on chat_sessions for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own chat sessions."
  on chat_sessions for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own chat sessions."
  on chat_sessions for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own chat sessions."
  on chat_sessions for delete
  using ( auth.uid() = user_id );

-- RLS for Chat Messages
alter table chat_messages enable row level security;

create policy "Users can view messages from their sessions."
  on chat_messages for select
  using ( 
    exists (
      select 1 from chat_sessions 
      where chat_sessions.id = chat_messages.session_id 
      and chat_sessions.user_id = auth.uid()
    )
  );

create policy "Users can insert messages into their sessions."
  on chat_messages for insert
  with check ( 
    exists (
      select 1 from chat_sessions 
      where chat_sessions.id = chat_messages.session_id 
      and chat_sessions.user_id = auth.uid()
    )
  );
