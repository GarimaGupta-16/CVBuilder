import { Link } from 'react-router-dom';
import { FileText, Cpu, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center w-full min-h-[calc(100vh-73px)] text-center px-4 relative overflow-hidden bg-[#0A0812]">
      
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-float z-0"></div>
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-accent-purple/20 rounded-full mix-blend-screen filter blur-[120px] animate-float z-0" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-accent-cyan/10 rounded-full mix-blend-screen filter blur-[120px] animate-float z-0" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full max-w-6xl py-12">
        {/* Hero Section */}
        <div className="max-w-4xl space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-sm font-semibold mb-4 mx-auto shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4" /> AI-Powered Career Assistant
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight text-white">
            Build Resumes That <br />
            <span className="text-gradient">Get You Hired.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto font-medium leading-relaxed">
            Create professional ATS-optimized resumes, analyze your match against job descriptions, and crush your next interview with AI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
            <Link to="/signup" className="btn-primary flex items-center group px-8 py-4 text-lg">
              Start Building Free <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="btn-secondary px-8 py-4 text-lg">
              Log In to Account
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 w-full mt-24 text-left animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          
          <div className="p-8 glass-card group hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600/40 to-brand-500/10 flex items-center justify-center mb-6 border border-brand-500/30 group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7 text-brand-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">Smart Builder</h3>
            <p className="text-text-muted font-medium leading-relaxed">6+ professional templates. Easily drag, drop, and edit your experience with live preview and AI optimizations.</p>
          </div>

          <div className="p-8 glass-card group hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-purple/40 to-accent-purple/10 flex items-center justify-center mb-6 border border-accent-purple/30 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-7 h-7 text-accent-purple" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">ATS Checker</h3>
            <p className="text-text-muted font-medium leading-relaxed">Instantly score your resume against job descriptions to ensure you pass screening filters and highlight key skills.</p>
          </div>

          <div className="p-8 glass-card group hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-cyan/30 to-accent-cyan/10 flex items-center justify-center mb-6 border border-accent-cyan/30 group-hover:scale-110 transition-transform">
              <Cpu className="w-7 h-7 text-accent-cyan" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">AI Mock Interviews</h3>
            <p className="text-text-muted font-medium leading-relaxed">Practice with interactive AI interviews tailored specifically to your resume and your target job role.</p>
          </div>

        </div>
      </div>
      
      {/* Footer minimal */}
      <footer className="mt-auto py-8 text-text-muted font-medium text-sm relative z-10 w-full border-t border-white/5">
        &copy; {new Date().getFullYear()} AI Resume Builder. Designed for modern careers.
      </footer>
    </div>
  );
};

export default LandingPage;
