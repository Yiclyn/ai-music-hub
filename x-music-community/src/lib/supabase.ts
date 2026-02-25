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

// 初始化存储桶
export const initializeStorage = async () => {
  try {
    console.log('检查存储桶状态...')
    
    // 检查存储桶是否存在
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('获取存储桶列表失败:', listError)
      return false
    }
    
    const mediaBucket = buckets?.find(bucket => bucket.name === 'media')
    
    if (!mediaBucket) {
      console.log('media 存储桶不存在，尝试创建...')
      
      const { error: createError } = await supabase.storage.createBucket('media', {
        public: true,
        allowedMimeTypes: ['image/*', 'video/*', 'audio/*'],
        fileSizeLimit: 52428800 // 50MB
      })
      
      if (createError) {
        console.error('创建存储桶失败:', createError)
        return false
      }
      
      console.log('media 存储桶创建成功')
    } else {
      console.log('media 存储桶已存在')
    }
    
    return true
  } catch (error) {
    console.error('初始化存储时发生错误:', error)
    return false
  }
}

// 测试上传功能
export const testUpload = async () => {
  try {
    const testFile = new Blob(['test'], { type: 'text/plain' })
    const testFileName = `test-${Date.now()}.txt`
    
    const { data, error } = await supabase.storage
      .from('media')
      .upload(testFileName, testFile)
    
    if (error) {
      console.error('测试上传失败:', error)
      return false
    }
    
    console.log('测试上传成功:', data)
    
    // 删除测试文件
    await supabase.storage.from('media').remove([testFileName])
    
    return true
  } catch (error) {
    console.error('测试上传时发生错误:', error)
    return false
  }
}