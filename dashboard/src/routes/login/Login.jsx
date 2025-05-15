import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeProviderContext } from '../../contexts/theme-context';

const Login = () => {
  const { login } = useContext(AuthContext);
  const { theme } = useContext(ThemeProviderContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center p-4 ${theme.startsWith('dark') ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`p-8 rounded-lg shadow-md w-full max-w-md ${theme.startsWith('dark') ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className={`text-3xl font-bold mb-2 ${theme.startsWith('dark') ? 'text-green-300' : 'text-gray-800'}`}>Login</h1>
        <p className={`mb-6 ${theme.startsWith('dark') ? 'text-gray-300' : 'text-gray-600'}`}>Sign in to your account</p>
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
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
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="flex justify-between items-center">
            <a
              href="#forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={(e) => {
                e.preventDefault();
                alert('Forgot password functionality');
              }}
            >
              Forgot password?
            </a>
          </div>
        </form>
        <div className="mt-8 text-center">
          <p className={theme.startsWith('dark') ? 'text-gray-300' : 'text-gray-600'}>
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Sign up now
            </Link>{' '}
            to create and manage your events.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
