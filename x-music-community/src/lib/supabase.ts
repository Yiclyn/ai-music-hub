import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fqwpvfihvesmifhwtleu.supabase.co'
const supabaseAnonKey = 'sb_publishable_mvTEIeipVJOaE4AI3HypCg_X2CD5PSu'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Post = {
  id: string
  content: string
  author_name: string
  author_avatar: string
  created_at: string
  likes_count: number
  media_url?: string
  media_type?: 'audio' | 'video' | 'image'
  cover_image?: string
}