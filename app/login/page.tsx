'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setError(error.message)
        } else {
            router.push('/')
        }
        setIsLoading(false)
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) {
            setError(error.message)
        } else {
            alert('注册成功，请登录！')
        }
        setIsLoading(false)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">登录 / 注册</h2>
                {error && <div className="mb-4 text-sm text-red-500 text-center">{error}</div>}

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">邮箱</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                            placeholder="你的邮箱地址"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">密码</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                            placeholder="密码"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            onClick={handleLogin}
                            disabled={isLoading}
                            className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {isLoading ? '加载中...' : '登录'}
                        </button>
                        <button
                            type="button"
                            onClick={handleSignUp}
                            disabled={isLoading}
                            className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-lg border border-slate-200 hover:bg-slate-200 transition disabled:opacity-50"
                        >
                            注册
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
