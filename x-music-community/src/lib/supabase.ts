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

// Initialize storage bucket if needed
export const initializeStorage = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets()
    const mediaBucket = buckets?.find(bucket => bucket.name === 'media')
    
    if (!mediaBucket) {
      const { error } = await supabase.storage.createBucket('media', {
        public: true,
        allowedMimeTypes: ['image/*', 'video/*', 'audio/*'],
        fileSizeLimit: 50 * 1024 * 1024 // 50MB
      })
      
      if (error) {
        console.error('Error creating media bucket:', error)
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error)
  }
}