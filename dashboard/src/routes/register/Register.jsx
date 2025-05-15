import React, { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { ThemeProviderContext } from '../../contexts/theme-context'
import { useNavigate, Link } from 'react-router-dom'

const Register = () => {
  const { register } = useContext(AuthContext)
  const { theme } = useContext(ThemeProviderContext)
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      return setError("Passwords do not match")
    }
    setLoading(true)
    try {
      await register(email, password, username)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center p-4 ${theme.startsWith('dark') ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`p-8 rounded-lg shadow-md w-full max-w-md ${theme.startsWith('dark') ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className={`text-3xl font-bold mb-2 ${theme.startsWith('dark') ? 'text-green-300' : 'text-gray-800'}`}>Register</h1>
        <p className={`mb-6 ${theme.startsWith('dark') ? 'text-gray-300' : 'text-gray-600'}`}>Create your account</p>
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className={`block text-sm font-medium mb-2 ${theme.startsWith('dark') ? 'text-gray-200' : 'text-gray-700'}`}>Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${theme.startsWith('dark') ? 'bg-gray-700 text-gray-100 border-gray-600' : ''}`}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-2 ${theme.startsWith('dark') ? 'text-gray-200' : 'text-gray-700'}`}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${theme.startsWith('dark') ? 'bg-gray-700 text-gray-100 border-gray-600' : ''}`}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className={`block text-sm font-medium mb-2 ${theme.startsWith('dark') ? 'text-gray-200' : 'text-gray-700'}`}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${theme.startsWith('dark') ? 'bg-gray-700 text-gray-100 border-gray-600' : ''}`}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${theme.startsWith('dark') ? 'text-gray-200' : 'text-gray-700'}`}>Repeat password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${theme.startsWith('dark') ? 'bg-gray-700 text-gray-100 border-gray-600' : ''}`}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <div className="mt-8 text-center">
          <p className={theme.startsWith('dark') ? 'text-gray-300' : 'text-gray-600'}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Login
            </Link>{' '}
            to access your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
