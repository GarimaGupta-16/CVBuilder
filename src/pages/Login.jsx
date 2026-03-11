import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] relative overflow-hidden bg-brand-bg">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-[20%] w-72 h-72 bg-brand-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-float z-0"></div>
      <div className="absolute bottom-0 left-[20%] w-72 h-72 bg-accent-purple/20 rounded-full mix-blend-screen filter blur-[120px] animate-float z-0" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md p-8 glass-card relative z-10 transition-colors">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-brand-500/10 rounded-2xl flex items-center justify-center mb-5 border border-brand-500/30">
            <LogIn className="w-7 h-7 text-brand-400" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Welcome Back</h2>
          <p className="text-text-muted mt-2 font-medium">Log in to continue building your resume</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 text-red-400 rounded-xl text-sm text-center border border-red-500/20 font-medium animate-fade-in-up">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-text-secondary mb-2">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3.5 bg-black/20 rounded-xl border border-white/10 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all placeholder-white/20 text-white"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-text-secondary mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3.5 bg-black/20 rounded-xl border border-white/10 focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all placeholder-white/20 text-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-4 mt-2 btn-primary"
          >
            Log In securely
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-muted font-medium">
          Don't have an account? <Link to="/signup" className="text-brand-400 font-bold hover:underline">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
