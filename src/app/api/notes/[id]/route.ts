import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabase } from '@/lib/supabase';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const db = createServerSupabase();

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.title    !== undefined) update.title     = body.title;
  if (body.content  !== undefined) update.content   = body.content;
  if (body.favorite !== undefined) update.favorite  = body.favorite;
  if (body.pinned   !== undefined) update.pinned    = body.pinned;
  if (body.tags     !== undefined) update.tags      = body.tags;
  if (body.folderId !== undefined) update.folder_id = body.folderId;

  const { data, error } = await db
    .from('notes')
    .update(update)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const db = createServerSupabase();

  const { error } = await db
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
