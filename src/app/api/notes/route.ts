import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabase } from '@/lib/supabase';
import { INITIAL_FOLDERS, INITIAL_NOTES, INITIAL_STICKIES } from '@/data/initialData';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = createServerSupabase();

  // Auto-seed on first login
  const { count } = await db
    .from('notes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (count === 0) {
    // Seed folders
    const folders = INITIAL_FOLDERS.map(f => ({ ...f, user_id: userId }));
    await db.from('folders').upsert(folders, { onConflict: 'id' });

    // Seed notes
    const notes = INITIAL_NOTES.map(n => ({
      id: n.id, user_id: userId, folder_id: n.folderId,
      title: n.title, content: n.content, favorite: n.favorite,
      pinned: n.pinned, tags: n.tags,
      created_at: n.createdAt, updated_at: n.updatedAt,
    }));
    await db.from('notes').upsert(notes, { onConflict: 'id' });

    // Seed stickies
    const stickies = INITIAL_STICKIES.map(s => ({ ...s, user_id: userId }));
    await db.from('stickies').upsert(stickies, { onConflict: 'id' });
  }

  const { data, error } = await db
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const db = createServerSupabase();

  const { data, error } = await db
    .from('notes')
    .insert({
      id:        body.id,
      user_id:   userId,
      folder_id: body.folderId,
      title:     body.title,
      content:   body.content,
      favorite:  body.favorite ?? false,
      pinned:    body.pinned   ?? false,
      tags:      body.tags     ?? [],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
