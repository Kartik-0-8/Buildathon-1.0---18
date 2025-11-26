import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Zap, Shield, Globe, Award, Rocket, Twitter, Github, Linkedin } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-primary-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 transform rotate-3 hover:rotate-0 transition-all duration-300">
              <span className="font-bold text-white text-xl">C</span>
            </div>
            <span className="text-xl font-bold tracking-tight">CollabX</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#community" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Community</a>
            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="bg-white text-gray-900 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl shadow-white/10">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 md:pt-48 md:pb-32 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-1.5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-medium text-gray-300">New Hackathons Added Daily</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight">
              Where <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary-500 to-purple-500 animate-gradient">Innovators</span> <br/>
              Unite & Build.
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed">
              Find your dream team, join global hackathons, and level up with AI-powered mentorship. The ultimate ecosystem for students and pros.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/signup" className="group flex items-center justify-center bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:translate-y-[-2px] shadow-2xl shadow-primary-600/30">
                  Get Started
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <button className="flex items-center justify-center bg-gray-800/50 hover:bg-gray-800 text-white border border-gray-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all backdrop-blur-sm">
                  View Demo
              </button>
            </div>
            
            <div className="pt-8 flex items-center gap-4 text-sm font-medium text-gray-500">
               <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                       <img key={i} src={`https://picsum.photos/40/40?random=${i}`} className="w-10 h-10 rounded-full border-2 border-gray-900" alt="User" />
                   ))}
               </div>
               <p>Joined by 10,000+ creators</p>
            </div>
          </div>

          <div className="relative animate-fade-in hidden lg:block perspective-1000">
             <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/30 to-purple-600/30 rounded-[2.5rem] blur-2xl transform rotate-3"></div>
             <img 
               src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
               alt="Team Collaboration" 
               className="relative rounded-[2.5rem] shadow-2xl border border-gray-700/50 w-full object-cover h-[600px] transform hover:rotate-1 transition-transform duration-500"
             />
             
             {/* Floating Cards */}
             <div className="absolute top-12 -left-12 bg-gray-800/90 backdrop-blur-xl p-5 rounded-2xl border border-gray-700 shadow-2xl animate-float">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-blue-500/20 rounded-xl">
                      <Globe className="text-blue-400" size={24} />
                   </div>
                   <div>
                      <p className="font-bold text-white">Global Reach</p>
                      <p className="text-xs text-gray-400">150+ Countries</p>
                   </div>
                </div>
             </div>

             <div className="absolute bottom-20 -right-8 bg-gray-800/90 backdrop-blur-xl p-5 rounded-2xl border border-gray-700 shadow-2xl animate-float delay-1000">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-green-500/20 rounded-xl">
                      <Zap className="text-green-400" size={24} />
                   </div>
                   <div>
                      <p className="font-bold text-white">AI Match</p>
                      <p className="text-xs text-gray-400">98% Success Rate</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-800/50 relative">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for the future of work</h2>
                <p className="text-gray-400 text-lg">We provide the tools you need to find your tribe and build the next big thing.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: Zap, title: "AI Matchmaking", desc: "Our Gemini-powered algorithm finds teammates who complement your skills and interests perfectly.", color: "text-yellow-400", bg: "bg-yellow-400/10" },
                    { icon: Award, title: "Gamified Growth", desc: "Earn XP, unlock badges, and level up your profile as you participate in hackathons and complete challenges.", color: "text-purple-400", bg: "bg-purple-400/10" },
                    { icon: Shield, title: "Verified Professionals", desc: "Connect with mentors and industry experts who are verified to provide top-tier guidance.", color: "text-green-400", bg: "bg-green-400/10" }
                ].map((feature, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 p-8 rounded-3xl hover:border-gray-600 transition-colors group">
                        <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <feature.icon size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
                { label: "Active Users", val: "10K+" },
                { label: "Hackathons", val: "500+" },
                { label: "Teams Formed", val: "2.5K" },
                { label: "Countries", val: "85+" }
            ].map((stat, i) => (
                <div key={i}>
                    <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stat.val}</div>
                    <div className="text-gray-500 uppercase tracking-wider text-sm font-semibold">{stat.label}</div>
                </div>
            ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 pt-20 pb-10 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-white">C</span>
                    </div>
                    <span className="text-xl font-bold">CollabX</span>
                </div>
                <p className="text-gray-400 max-w-sm">
                    The leading platform for connecting talent with opportunities. Build together, grow together.
                </p>
              </div>
              <div>
                  <h4 className="font-bold text-white mb-6">Platform</h4>
                  <ul className="space-y-4 text-gray-400">
                      <li><a href="#" className="hover:text-primary-400">Hackathons</a></li>
                      <li><a href="#" className="hover:text-primary-400">Mentorship</a></li>
                      <li><a href="#" className="hover:text-primary-400">Pricing</a></li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold text-white mb-6">Company</h4>
                  <ul className="space-y-4 text-gray-400">
                      <li><a href="#" className="hover:text-primary-400">About</a></li>
                      <li><a href="#" className="hover:text-primary-400">Blog</a></li>
                      <li><a href="#" className="hover:text-primary-400">Careers</a></li>
                  </ul>
              </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center border-t border-gray-800 pt-8 text-sm text-gray-500">
              <p>&copy; 2024 CollabX Inc. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                  <a href="#" className="hover:text-white"><Twitter size={20}/></a>
                  <a href="#" className="hover:text-white"><Github size={20}/></a>
                  <a href="#" className="hover:text-white"><Linkedin size={20}/></a>
              </div>
          </div>
      </footer>
    </div>
  );
};