import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { EnvelopeIcon, KeyIcon } from '@heroicons/react/24/solid'
import { useAuth } from '@/hooks'

/**
 * Login page
 */
export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const isInvalid = !email.trim() || !password.trim()

  const handleClick = () => {
    if (isInvalid) return

    signIn(email)

    // Vue版と同じロジック: redirectNameがあればそこへ、なければカタログへ
    const params = new URLSearchParams(location.search)
    const redirectName = params.get('redirectName')

    if (!redirectName) {
      navigate('/')
    } else {
      // Note: Vue版のような完全なリダイレクト処理を簡略化
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="container mx-auto max-w-sm">
      <form className="mt-8">
        <div className="form-group">
          <div className="flex justify-between">
            <EnvelopeIcon className="h-8 w-8 text-blue-500/50" />
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="email"
              autoComplete="username"
              className="w-full border-b px-4 py-2 placeholder-gray-500/50 focus:border-b-2 focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
          <p className="px-8 py-2 text-sm text-red-500"></p>
        </div>
        <div className="form-group mt-4">
          <div className="flex justify-between">
            <KeyIcon className="h-8 w-8 text-blue-500/50" />
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="password"
              autoComplete="current-password"
              className="w-full border-b px-4 py-2 placeholder-gray-500/50 focus:border-b-2 focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
          <p className="px-8 py-2 text-sm text-red-500"></p>
        </div>
        <div className="form-group mt-8">
          <button
            type="button"
            className="w-full rounded-sm bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:bg-blue-500/50"
            disabled={isInvalid}
            onClick={handleClick}
          >
            ログイン
          </button>
        </div>
      </form>
    </div>
  )
}
