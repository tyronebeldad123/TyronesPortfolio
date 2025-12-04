import { useState, useEffect } from 'react';
import JungleLushDemo from './demos/JungleLushDemo';
import WeatherWonderDemo from './demos/WeatherWonderDemo'; // Add this import

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [currentDemo, setCurrentDemo] = useState(null); // Track which demo to show

  // Add scroll effect for navigation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const skills = [
    { 
      category: 'Frontend', 
      items: ['React', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Tailwind CSS', 'Vite', 'Next.js'],
      icon: '💻'
    },
    { 
      category: 'Backend', 
      items: ['Node.js', 'Python', 'Express.js', 'SQL', 'MongoDB', 'REST APIs', 'GraphQL'],
      icon: '⚙️'
    },
    { 
      category: 'Tools & Others', 
      items: ['Git', 'GitHub', 'VS Code', 'Docker', 'Agile/Scrum', 'Figma', 'Postman'],
      icon: '🛠️'
    }
  ];

  const projects = [
    {
      id: 1,
      title: 'VocabVenture',
      description: 'English vocabulary game targeted towards grade seven students.',
      tech: ['React', 'Java', 'Springboot', 'MySQL'],
      status: 'Live',
      hasDemo: true,
      demoComponent: 'vocabventure' // Add identifier
    },
    {
      id: 2,
      title: 'WeatherWonder',
      description: 'A Simple Weather app that uses a free public API.',
      tech: ['React', 'APIs'],
      status: 'Live',
      hasDemo: true, // Changed to true
      demoComponent: 'weatherwonder' // Add identifier
    },
    {
      id: 3,
      title: 'AI Content Analyzer',
      description: 'Machine learning tool for content analysis and recommendations',
      tech: ['Python', 'FastAPI', 'React', 'OpenAI API'],
      status: 'Completed',  
      hasDemo: false
    }
  ];

  const navItems = ['Home', 'About', 'Skills', 'Projects', 'Contact'];

  // Function to handle project click
  const handleProjectClick = (project) => {
  if (project.hasDemo) {
    setCurrentDemo(project.demoComponent);
    setShowDemo(true);
  } else {
    alert(`Project details for ${project.title} coming soon!`);
  }
};


  // Function to close demo
  const handleCloseDemo = () => {
    setShowDemo(false);
    setCurrentDemo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      {/* Demo Modal */}
      {showDemo && currentDemo === 'vocabventure' && (
        <JungleLushDemo onClose={handleCloseDemo} />
      )}
      {showDemo && currentDemo === 'weatherwonder' && (
        <WeatherWonderDemo onClose={handleCloseDemo} />
      )}
      
      {/* Enhanced Navigation - FIXED WIDTH */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50 py-3' 
          : 'bg-transparent py-5'
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Tyrone's Portfolio
            </h1>
            <div className="flex gap-2 sm:gap-4 lg:gap-6">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveSection(item.toLowerCase());
                    const element = document.getElementById(item.toLowerCase());
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`relative px-2 sm:px-3 py-2 text-sm lg:text-base font-medium transition-all duration-300 ${
                    activeSection === item.toLowerCase() 
                      ? 'text-cyan-400' 
                      : 'text-slate-300 hover:text-cyan-300'
                  }`}
                >
                  {item}
                  {activeSection === item.toLowerCase() && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - FULL WIDTH FIX */}
      <section id="home" className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden w-full">
        <div className="w-full">
          <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between lg:gap-12 max-w-7xl mx-auto">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 mb-6">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                <span className="text-sm">Available for OJT Opportunities</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Hi, I'm <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Tyrone Beldad
                </span>
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl text-slate-300 mb-4 font-light">
                Aspiring Full Stack Developer
              </p>
              <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0">
                Passionate about building innovative digital solutions. Currently pursuing my Bachelor's in 
                Information Technology and seeking hands-on experience through OJT to bridge academic 
                knowledge with real-world applications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  <span>View Projects</span>
                  <span>→</span>
                </button>
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 sm:px-8 py-3 border-2 border-cyan-400/50 rounded-lg font-semibold hover:bg-cyan-400/10 hover:border-cyan-400 transition-all hover:shadow-lg hover:shadow-cyan-400/10"
                >
                  Contact Me
                </button>
              </div>
            </div>
            <div className="hidden lg:block lg:w-1/2 mt-12 lg:mt-0">
              <div className="relative mx-auto max-w-md">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-xl rounded-full"></div>
                <div className="relative bg-slate-800/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                        <span className="text-xl">🎓</span>
                      </div>
                      <div>
                        <p className="font-semibold">4th Year IT Student</p>
                        <p className="text-sm text-slate-400">Major in Software Development</p>
                      </div>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                        <p className="text-2xl font-bold text-cyan-400">15+</p>
                        <p className="text-sm text-slate-400">Projects</p>
                      </div>
                      <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                        <p className="text-2xl font-bold text-cyan-400">10+</p>
                        <p className="text-sm text-slate-400">Technologies</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - FIXED */}
      <section id="about" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-slate-900/50 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 relative inline-block">
              About Me
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 sm:w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></span>
            </h3>
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto">Get to know more about my journey</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-6">
              <div className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <h4 className="text-2xl font-bold mb-4 text-cyan-400">My Journey</h4>
                <p className="text-slate-300 mb-4">
                  As a 4th-year IT student specializing in software development, I've immersed myself in both 
                  frontend and backend technologies. My academic journey has provided me with a strong 
                  foundation in computer science principles and practical development skills.
                </p>
                <p className="text-slate-300">
                  I'm particularly passionate about creating user-centric applications that solve real-world 
                  problems. My goal is to join an innovative team where I can contribute meaningfully while 
                  accelerating my learning curve in a professional environment.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <p className="font-semibold">Education</p>
                  <p className="text-sm text-slate-400">BS in Information Technology</p>
                </div>
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <p className="font-semibold">Focus</p>
                  <p className="text-sm text-slate-400">Full Stack Development</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="p-4 sm:p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl mb-4">🎯</div>
                <h4 className="text-lg sm:text-xl font-bold mb-2">My Goal</h4>
                <p className="text-slate-400 text-sm">To secure an OJT position where I can apply my skills and learn industry best practices</p>
              </div>
              <div className="p-4 sm:p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl mb-4">🚀</div>
                <h4 className="text-lg sm:text-xl font-bold mb-2">My Approach</h4>
                <p className="text-slate-400 text-sm">Problem-solving oriented with a focus on clean, maintainable code and user experience</p>
              </div>
              <div className="p-4 sm:p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl mb-4">💡</div>
                <h4 className="text-lg sm:text-xl font-bold mb-2">My Passion</h4>
                <p className="text-slate-400 text-sm">Building innovative solutions that make a difference in people's lives</p>
              </div>
              <div className="p-4 sm:p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl mb-4">🤝</div>
                <h4 className="text-lg sm:text-xl font-bold mb-2">Looking For</h4>
                <p className="text-slate-400 text-sm">Mentorship and collaborative projects to grow as a developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section - FIXED */}
      <section id="skills" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 relative inline-block">
              Skills & Technologies
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 sm:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></span>
            </h3>
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto">Technologies I've worked with and continue to learn</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {skills.map((skillGroup, index) => (
              <div 
                key={index} 
                className="group bg-slate-800/30 rounded-2xl p-6 sm:p-8 border border-slate-700/50 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl">{skillGroup.icon}</div>
                  <h4 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {skillGroup.category}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {skillGroup.items.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 sm:px-4 py-2 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-full text-sm hover:bg-gradient-to-br hover:from-cyan-900/30 hover:to-blue-900/30 hover:border-cyan-400/30 transition-all duration-300 group-hover:scale-105"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 sm:mt-16 p-6 sm:p-8 bg-gradient-to-r from-slate-800/30 to-slate-900/30 rounded-2xl border border-slate-700/50">
            <h4 className="text-xl sm:text-2xl font-bold mb-6 text-center text-cyan-400">Currently Learning</h4>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {['Next.js 14', 'TypeScript', 'AWS', 'Blockchain Technology', 'Cybersecurity'].map((item, index) => (
                <span 
                  key={index}
                  className="px-4 sm:px-5 py-2 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-400/20 rounded-full text-cyan-400 font-medium text-sm sm:text-base"
                >
                  {item} 📚
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section - UPDATED */}
      <section id="projects" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-slate-900/50 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 relative inline-block">
              Featured Projects
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 sm:w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></span>
            </h3>
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto">A selection of my recent work and academic projects</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 backdrop-blur-sm"
              >
                <div className="h-48 sm:h-56 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                  <span className="text-6xl sm:text-7xl opacity-30 group-hover:scale-110 transition-transform duration-500">
                    {project.id === 1 ? '📚' : project.id === 2 ? '☁️' : '🤖'}
                  </span>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === 'Live' ? 'bg-green-500/20 text-green-400' :
                      project.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {project.status}
                    </span>
                    {project.hasDemo && (
                      <div className="mt-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-cyan-400/30 rounded-full text-xs font-semibold text-cyan-300">
                        🎮 Live Demo
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg sm:text-xl font-bold">{project.title}</h4>
                    <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                      ↗
                    </span>
                  </div>
                  <p className="text-slate-400 mb-6 text-sm sm:text-base">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 sm:px-3 py-1 bg-slate-800/50 rounded-lg text-xs text-cyan-400 border border-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => handleProjectClick(project)}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 group-hover:scale-[1.02] text-sm sm:text-base ${
                      project.hasDemo 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg hover:shadow-cyan-500/20' 
                        : 'border border-slate-700 hover:border-cyan-400/50 hover:bg-cyan-400/5'
                    }`}
                  >
                    {project.hasDemo ? '🎮 Live Demo' : 'View Project Details'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 sm:mt-12">
            <button className="px-6 sm:px-8 py-3 border-2 border-cyan-400/50 rounded-lg font-semibold hover:bg-cyan-400/10 hover:border-cyan-400 transition-all hover:shadow-lg hover:shadow-cyan-400/10 text-sm sm:text-base">
              View All Projects →
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section - FIXED */}
      <section id="contact" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 relative inline-block">
              Get In Touch
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 sm:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></span>
            </h3>
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto">
              I'm actively seeking OJT opportunities starting December, 2025. Let's connect and discuss how I can contribute to your team!
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="space-y-6 sm:space-y-8">
              <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <h4 className="text-xl sm:text-2xl font-bold mb-6 text-cyan-400">Contact Information</h4>
                <div className="space-y-4 sm:space-y-6">
                  {[
                    { icon: '📧', label: 'Email', value: 'tyroneclint.beldad@cit.edu', action: 'mailto:' },
                    { icon: '💼', label: 'LinkedIn', value: 'www.linkedin.com/in/tyrone-beldad-18b901365', action: 'https://' },
                    { icon: '🐙', label: 'GitHub', value: 'github.com/tyronebeldad123', action: 'https://' },
                    { icon: '📱', label: 'Phone', value: '+63 949 877 6653', action: 'tel:' }
                  ].map((item, index) => (
                    <a
                      key={index}
                      href={`${item.action}${item.value}`}
                      target={item.label !== 'Email' && item.label !== 'Phone' ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800/80 transition-all group"
                    >
                      <div className="text-2xl">{item.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-400">{item.label}</p>
                        <p className="font-medium group-hover:text-cyan-400 transition-colors text-sm sm:text-base">{item.value}</p>
                      </div>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <h4 className="text-lg sm:text-xl font-bold mb-4 text-cyan-400">Availability</h4>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-sm sm:text-base">Available for OJT: <strong>500 Hours Total</strong></span>
                </div>
                <p className="text-sm text-slate-400 mt-2">Flexible schedule to accommodate academic requirements</p>
              </div>
            </div>
            
            <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
              <h4 className="text-xl sm:text-2xl font-bold mb-6 text-cyan-400">Send Me a Message</h4>
              <form className="space-y-4 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-400">Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400/50 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-400">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400/50 transition-colors"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-400">Subject</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400/50 transition-colors"
                    placeholder="OJT Opportunity Inquiry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-400">Message</label>
                  <textarea 
                    rows="4"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400/50 transition-colors"
                    placeholder="Tell me about the opportunity..."
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-[1.02]"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - FIXED */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-700/50 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <div>
              <h5 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Tyrone Beldad
              </h5>
              <p className="text-slate-400 text-xs sm:text-sm mt-2">Aspiring Full Stack Developer & IT Student</p>
            </div>
            <div className="flex gap-4 sm:gap-6">
              {['LinkedIn', 'GitHub', 'Twitter', 'Instagram'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="text-slate-400 hover:text-cyan-400 transition-colors hover:scale-110 text-sm sm:text-base"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-6 sm:my-8"></div>
          <p className="text-center text-slate-500 text-xs sm:text-sm">
            © {new Date().getFullYear()} Tyrone Beldad. Built with React & Tailwind CSS. 
            <span className="block mt-1">Made with ❤️ for the developer community</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;