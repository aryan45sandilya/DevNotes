import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabase } from '@/lib/supabase';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = createServerSupabase();

  const { data, error } = await db
    .from('folders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('FOLDERS GET ERROR:', error);
    return NextResponse.json({ error: error.message, details: error }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const db = createServerSupabase();

  // Seed initial data on first folder creation if none exist
  const { count } = await db
    .from('folders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const { data, error } = await db
    .from('folders')
    .insert({ id: body.id, user_id: userId, name: body.name, icon: body.icon ?? 'Folder', color: body.color ?? 'cyan' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
