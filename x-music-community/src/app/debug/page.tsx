'use client'

import { useState } from 'react'
import { supabase, initializeStorage, testUpload } from '@/lib/supabase'
import Link from 'next/link'

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testConnection = async () => {
    setIsLoading(true)
    setLogs([])
    
    try {
      addLog('开始测试 Supabase 连接...')
      
      // 测试基本连接
      addLog('测试数据库连接...')
      const { data, error } = await supabase.from('posts').select('count').limit(1)
      if (error) {
        addLog(`数据库连接失败: ${error.message}`)
        addLog('可能原因: posts 表不存在或权限不足')
      } else {
        addLog('数据库连接成功')
      }
      
      // 检查 posts 表结构
      addLog('检查 posts 表结构...')
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .limit(1)
      
      if (postsError) {
        addLog(`posts 表查询失败: ${postsError.message}`)
        if (postsError.message.includes('relation "public.posts" does not exist')) {
          addLog('❌ posts 表不存在，需要创建')
        } else if (postsError.message.includes('column') && postsError.message.includes('does not exist')) {
          addLog('❌ posts 表字段不完整，需要添加缺失字段')
        }
      } else {
        addLog('✅ posts 表存在且可访问')
        if (postsData && postsData.length > 0) {
          addLog(`表中有 ${postsData.length} 条记录`)
          addLog(`字段: ${Object.keys(postsData[0]).join(', ')}`)
        } else {
          addLog('表为空，但结构正常')
        }
      }
      
      // 检查表结构详情
      addLog('获取表结构详情...')
      try {
        const { data: schemaData, error: schemaError } = await supabase.rpc('get_table_schema', { table_name: 'posts' })
        if (schemaError) {
          addLog('无法获取表结构详情（这是正常的）')
        } else {
          addLog('表结构详情获取成功')
        }
      } catch (e) {
        // 忽略这个错误，因为 get_table_schema 函数可能不存在
      }
      
      // 测试插入权限
      addLog('测试 posts 表插入权限...')
      const testPost = {
        content: '测试帖子',
        author_name: '测试用户',
        author_avatar: 'https://example.com/avatar.jpg',
        likes_count: 0
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from('posts')
        .insert([testPost])
        .select()
      
      if (insertError) {
        addLog(`插入测试失败: ${insertError.message}`)
        addLog('可能原因: 缺少 INSERT 权限或字段不匹配')
      } else {
        addLog('✅ 插入权限正常')
        // 清理测试数据
        if (insertData && insertData.length > 0) {
          await supabase.from('posts').delete().eq('id', insertData[0].id)
          addLog('测试数据已清理')
        }
      }
      
      // 测试存储桶
      addLog('检查存储桶...')
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
      if (bucketError) {
        addLog(`获取存储桶失败: ${bucketError.message}`)
      } else {
        addLog(`找到 ${buckets?.length || 0} 个存储桶`)
        buckets?.forEach(bucket => {
          addLog(`- 存储桶: ${bucket.name} (公开: ${bucket.public})`)
        })
      }
      
      // 初始化存储
      addLog('初始化存储...')
      const initSuccess = await initializeStorage()
      addLog(`存储初始化: ${initSuccess ? '成功' : '失败'}`)
      
      // 测试上传
      addLog('测试文件上传...')
      const uploadSuccess = await testUpload()
      addLog(`上传测试: ${uploadSuccess ? '成功' : '失败'}`)
      
    } catch (error) {
      addLog(`测试过程中发生错误: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const createCompleteTable = async () => {
    setIsLoading(true)
    addLog('开始创建完整的 posts 表...')
    
    try {
      // 完整的表创建脚本
      const createScript = `
        -- 删除现有表
        DROP TABLE IF EXISTS public.posts CASCADE;
        
        -- 创建完整的 posts 表
        CREATE TABLE public.posts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          content TEXT NOT NULL,
          author_name VARCHAR(255) NOT NULL,
          author_avatar TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          likes_count INTEGER DEFAULT 0,
          media_url TEXT,
          media_type VARCHAR(50) CHECK (media_type IN ('audio', 'video', 'image')),
          cover_image TEXT
        );
        
        -- 启用 RLS
        ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
        
        -- 创建策略
        CREATE POLICY "Allow public read posts" ON public.posts FOR SELECT TO public USING (true);
        CREATE POLICY "Allow public insert posts" ON public.posts FOR INSERT TO public WITH CHECK (true);
        CREATE POLICY "Allow public update posts" ON public.posts FOR UPDATE TO public USING (true) WITH CHECK (true);
        CREATE POLICY "Allow public delete posts" ON public.posts FOR DELETE TO public USING (true);
        
        -- 创建索引
        CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
        
        -- 插入测试数据
        INSERT INTO public.posts (content, author_name, author_avatar, likes_count) VALUES
        ('欢迎来到 MusicX 音乐社区！🎵', '系统管理员', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', 0);
      `
      
      addLog('执行表创建脚本...')
      
      // 由于 Supabase 客户端可能不支持复杂的 SQL 脚本，我们分步执行
      const steps = [
        'DROP TABLE IF EXISTS public.posts CASCADE',
        `CREATE TABLE public.posts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          content TEXT NOT NULL,
          author_name VARCHAR(255) NOT NULL,
          author_avatar TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          likes_count INTEGER DEFAULT 0,
          media_url TEXT,
          media_type VARCHAR(50),
          cover_image TEXT
        )`,
        'ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY'
      ]
      
      for (let i = 0; i < steps.length; i++) {
        addLog(`执行步骤 ${i + 1}/${steps.length}...`)
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: steps[i] })
          if (error) {
            addLog(`步骤 ${i + 1} 失败: ${error.message}`)
          } else {
            addLog(`步骤 ${i + 1} 成功`)
          }
        } catch (e) {
          addLog(`步骤 ${i + 1} 执行异常，请手动在 SQL Editor 中执行`)
        }
      }
      
      // 验证表是否创建成功
      addLog('验证表创建结果...')
      const { data: testData, error: testError } = await supabase
        .from('posts')
        .select('*')
        .limit(1)
      
      if (testError) {
        addLog(`❌ 表创建验证失败: ${testError.message}`)
        addLog('请手动在 Supabase SQL Editor 中执行完整脚本')
      } else {
        addLog('✅ posts 表创建成功！')
      }
      
    } catch (error) {
      addLog(`创建表过程中发生错误: ${error}`)
      addLog('请手动在 Supabase SQL Editor 中执行 SQL 脚本')
    } finally {
      setIsLoading(false)
    }
  }

  const fixTableStructure = async () => {
    setIsLoading(true)
    addLog('开始修复 posts 表结构...')
    
    try {
      // 添加缺失的字段
      const alterQueries = [
        'ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author_avatar TEXT;',
        'ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS media_url TEXT;',
        'ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS media_type VARCHAR(50);',
        'ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS cover_image TEXT;'
      ]
      
      for (const query of alterQueries) {
        addLog(`执行: ${query}`)
        const { error } = await supabase.rpc('exec_sql', { sql: query })
        if (error) {
          addLog(`执行失败: ${error.message}`)
        } else {
          addLog('执行成功')
        }
      }
      
      // 验证表结构
      addLog('验证表结构...')
      const { data: testData, error: testError } = await supabase
        .from('posts')
        .select('*')
        .limit(1)
      
      if (testError) {
        addLog(`验证失败: ${testError.message}`)
      } else {
        addLog('✅ 表结构修复成功')
      }
      
    } catch (error) {
      addLog(`修复过程中发生错误: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testFileUpload = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'audio/*,video/*,image/*'
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      
      setIsLoading(true)
      addLog(`开始上传文件: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`)
      
      try {
        const fileName = `test-${Date.now()}-${file.name}`
        
        const { data, error } = await supabase.storage
          .from('media')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (error) {
          addLog(`上传失败: ${error.message}`)
        } else {
          addLog(`上传成功: ${data.path}`)
          
          // 获取公共URL
          const { data: urlData } = supabase.storage
            .from('media')
            .getPublicUrl(fileName)
          
          addLog(`公共URL: ${urlData.publicUrl}`)
          
          // 清理测试文件
          await supabase.storage.from('media').remove([fileName])
          addLog('测试文件已清理')
        }
      } catch (error) {
        addLog(`上传过程中发生错误: ${error}`)
      } finally {
        setIsLoading(false)
      }
    }
    
    input.click()
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/" className="text-primary hover:underline">
            ← 返回首页
          </Link>
          <h1 className="text-2xl font-bold">Supabase 调试工具</h1>
        </div>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testConnection}
            disabled={isLoading}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? '测试中...' : '测试连接'}
          </button>
          
          <button
            onClick={createCompleteTable}
            disabled={isLoading}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 ml-4"
          >
            重新创建 posts 表
          </button>
          
          <button
            onClick={fixTableStructure}
            disabled={isLoading}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 ml-4"
          >
            修复表结构
          </button>
          
          <button
            onClick={testFileUpload}
            disabled={isLoading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 ml-4"
          >
            测试文件上传
          </button>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-4 h-96 overflow-y-auto">
          <h2 className="font-semibold mb-4">调试日志:</h2>
          {logs.length === 0 ? (
            <p className="text-gray-500">点击"测试连接"开始调试...</p>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="text-sm font-mono">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">配置信息:</h3>
          <p><strong>Supabase URL:</strong> https://fqwpvfihvesmifhwtleu.supabase.co</p>
          <p><strong>存储桶名称:</strong> media</p>
          <p><strong>支持的文件类型:</strong> 音频、视频、图片</p>
          <p><strong>文件大小限制:</strong> 50MB</p>
        </div>
        
        <div className="mt-8 p-4 bg-red-50 rounded-lg">
          <h3 className="font-semibold mb-2 text-red-800">🚨 如果遇到字段缺失错误，请执行:</h3>
          <div className="bg-gray-800 text-green-400 p-4 rounded text-sm font-mono overflow-x-auto">
            <pre>{`-- 添加缺失的字段
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author_avatar TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS media_url TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS media_type VARCHAR(50);
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS cover_image TEXT;

-- 验证表结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'posts' AND table_schema = 'public'
ORDER BY ordinal_position;`}</pre>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold mb-2">如果 posts 表不存在，请执行以下 SQL:</h3>
          <div className="bg-gray-800 text-green-400 p-4 rounded text-sm font-mono overflow-x-auto">
            <pre>{`-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 创建 posts 表
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  media_url TEXT,
  media_type VARCHAR(50) CHECK (media_type IN ('audio', 'video', 'image')),
  cover_image TEXT
);

-- 2. 启用行级安全 (RLS)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 3. 创建策略：允许所有人查看帖子
CREATE POLICY "Allow public read posts" ON public.posts
FOR SELECT TO public USING (true);

-- 4. 创建策略：允许所有人创建帖子
CREATE POLICY "Allow public insert posts" ON public.posts
FOR INSERT TO public WITH CHECK (true);

-- 5. 创建策略：允许所有人更新帖子
CREATE POLICY "Allow public update posts" ON public.posts
FOR UPDATE TO public
USING (true)
WITH CHECK (true);`}</pre>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            完整的 SQL 脚本请查看项目根目录的 <code>database-setup.sql</code> 文件
          </p>
        </div>
      </div>
    </div>
  )
}