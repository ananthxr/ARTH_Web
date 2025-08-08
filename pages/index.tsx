// Home page - Team Registration Form
// This is the main registration page where teams sign up

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { registerTeam, type Team } from '@/lib/firestore';

export default function Home() {
  // State to manage form data
  const [formData, setFormData] = useState({
    teamName: '',
    player1: '',
    player2: '',
    email: '',
    phoneNumber: ''
  });

  // State to manage UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredTeam, setRegisteredTeam] = useState<Team | null>(null);
  const [error, setError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [focusedField, setFocusedField] = useState('');

  // Handle mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous states
    setError('');
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.teamName.trim() || !formData.player1.trim() || !formData.player2.trim() || !formData.email.trim() || !formData.phoneNumber.trim()) {
        throw new Error('Please fill in all fields');
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Basic phone number validation (allow various formats)
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,15}$/;
      if (!phoneRegex.test(formData.phoneNumber.trim())) {
        throw new Error('Please enter a valid phone number');
      }

      // Team name validation
      if (formData.teamName.trim().length < 2 || formData.teamName.trim().length > 30) {
        throw new Error('Team name must be between 2 and 30 characters');
      }

      // Register the team
      const team = await registerTeam(
        formData.teamName.trim(),
        formData.player1.trim(),
        formData.player2.trim(),
        formData.email.trim(),
        formData.phoneNumber.trim()
      );

      // Show success message
      setRegisteredTeam(team);
      
      // Clear the form
      setFormData({
        teamName: '',
        player1: '',
        player2: '',
        email: '',
        phoneNumber: ''
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle registering another team
  const handleRegisterAnother = () => {
    setRegisteredTeam(null);
    setError('');
  };

  return (
    <>
      {/* Animated Background with Images and Liquid Effects */}
      <div className="treasure-hunt-bg">
        {/* Large Treasure Images */}
        <div className="floating-treasure-img treasure-chest" 
             style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 150'%3E%3Cdefs%3E%3ClinearGradient id='chest' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' style='stop-color:%23D4AF37'/%3E%3Cstop offset='100%25' style='stop-color:%23B8860B'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='20' y='60' width='160' height='80' fill='url(%23chest)' rx='10'/%3E%3Crect x='30' y='40' width='140' height='50' fill='%23DAA520' rx='10'/%3E%3Ccircle cx='100' cy='90' r='8' fill='%23FFD700'/%3E%3C/svg%3E")`}}>
        </div>

        <div className="floating-treasure-img pirate-ship"
             style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Cdefs%3E%3ClinearGradient id='ship' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' style='stop-color:%238B4513'/%3E%3Cstop offset='100%25' style='stop-color:%23654321'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M50 150 Q150 120 250 150 L240 130 Q150 100 60 130 Z' fill='url(%23ship)'/%3E%3Crect x='140' y='60' width='6' height='70' fill='%23654321'/%3E%3Cpolygon points='120,60 120,100 180,80' fill='%23FFFACD'/%3E%3Ctext x='150' y='45' fill='%23000' font-size='20'%3E⚡%3C/text%3E%3C/svg%3E")`}}>
        </div>

        <div className="floating-treasure-img treasure-map"
             style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 150'%3E%3Cdefs%3E%3ClinearGradient id='paper' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' style='stop-color:%23F4E4BC'/%3E%3Cstop offset='100%25' style='stop-color:%23DEB887'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='20' y='20' width='160' height='110' fill='url(%23paper)' rx='5'/%3E%3Cpath d='M40 50 Q80 40 120 50 T160 50' stroke='%23654321' stroke-width='2' fill='none'/%3E%3Ccircle cx='140' cy='80' r='8' fill='%23FF0000' opacity='0.7'/%3E%3Ctext x='135' y='85' fill='%23FFFFFF' font-size='12'%3EX%3C/text%3E%3C/svg%3E")`}}>
        </div>

        <div className="floating-treasure-img compass"
             style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 150'%3E%3Cdefs%3E%3CradialGradient id='compass' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' style='stop-color:%23FFD700'/%3E%3Cstop offset='100%25' style='stop-color:%23B8860B'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='75' cy='75' r='60' fill='url(%23compass)' stroke='%23654321' stroke-width='4'/%3E%3Cpolygon points='75,25 85,65 75,70 65,65' fill='%23FF0000'/%3E%3Cpolygon points='75,80 85,85 75,125 65,85' fill='%23FFFFFF'/%3E%3Ctext x='75' y='20' text-anchor='middle' fill='%23654321' font-size='14' font-weight='bold'%3EN%3C/text%3E%3C/svg%3E")`}}>
        </div>

        <div className="floating-treasure-img gem"
             style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='gem' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' style='stop-color:%2300BFFF'/%3E%3Cstop offset='50%25' style='stop-color:%230080FF'/%3E%3Cstop offset='100%25' style='stop-color:%23004080'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpolygon points='60,20 90,50 60,100 30,50' fill='url(%23gem)' stroke='%23000080' stroke-width='2'/%3E%3Cpolygon points='45,35 60,20 75,35 60,50' fill='%23FFFFFF' opacity='0.3'/%3E%3C/svg%3E")`}}>
        </div>

        {/* Liquid Wave Effects */}
        <div className="liquid-wave wave-1"></div>
        <div className="liquid-wave wave-2"></div>
        <div className="liquid-wave wave-3"></div>

        {/* Interactive Cursor Effects */}
        <div 
          className="cursor-glow" 
          style={{
            left: mousePosition.x - 50,
            top: mousePosition.y - 50,
            opacity: focusedField ? 0.8 : 0.3
          }}
        ></div>

        {/* Floating Particles */}
        <div className="floating-particles">
          {[...Array(15)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        body {
          background: linear-gradient(135deg, #0F2027 0%, #203A43 25%, #2C5364 50%, #1e3c72 75%, #2a5298 100%);
          background-attachment: fixed;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .treasure-hunt-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: -1;
          overflow: hidden;
        }

        .floating-treasure-img {
          position: absolute;
          width: 120px;
          height: 120px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          filter: drop-shadow(0 8px 20px rgba(0,0,0,0.3));
          animation: floatTreasureImg 8s ease-in-out infinite;
        }

        .treasure-chest {
          top: 15%;
          left: 10%;
          animation-delay: 0s;
          animation-duration: 10s;
        }

        .pirate-ship {
          top: 60%;
          right: 15%;
          width: 180px;
          height: 120px;
          animation-delay: 2s;
          animation-duration: 15s;
        }

        .treasure-map {
          bottom: 20%;
          left: 15%;
          animation-delay: 4s;
          animation-duration: 12s;
        }

        .compass {
          top: 25%;
          right: 25%;
          animation-delay: 1s;
          animation-duration: 8s;
        }

        .gem {
          bottom: 35%;
          right: 10%;
          animation-delay: 3s;
          animation-duration: 9s;
        }

        .liquid-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 150px;
          opacity: 0.4;
        }

        .wave-1 {
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(0,191,255,0.3) 25%, 
            rgba(0,128,255,0.3) 50%, 
            rgba(0,191,255,0.3) 75%, 
            transparent 100%);
          animation: liquidWave 12s ease-in-out infinite;
          animation-delay: 0s;
        }

        .wave-2 {
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255,215,0,0.2) 25%, 
            rgba(255,140,0,0.2) 50%, 
            rgba(255,215,0,0.2) 75%, 
            transparent 100%);
          animation: liquidWave 15s ease-in-out infinite reverse;
          animation-delay: -2s;
          height: 100px;
        }

        .wave-3 {
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(139,69,19,0.2) 25%, 
            rgba(160,82,45,0.2) 50%, 
            rgba(139,69,19,0.2) 75%, 
            transparent 100%);
          animation: liquidWave 18s ease-in-out infinite;
          animation-delay: -4s;
          height: 80px;
        }

        .cursor-glow {
          position: fixed;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(102,126,234,0.4) 0%, rgba(118,75,162,0.2) 50%, transparent 100%);
          border-radius: 50%;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .floating-particles {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: radial-gradient(circle, #FFD700, #FFA500);
          border-radius: 50%;
          animation: floatParticle 20s linear infinite;
        }

        .particle-1 { top: 10%; left: 20%; animation-delay: 0s; }
        .particle-2 { top: 30%; left: 80%; animation-delay: -2s; }
        .particle-3 { top: 70%; left: 30%; animation-delay: -4s; }
        .particle-4 { top: 50%; left: 60%; animation-delay: -6s; }
        .particle-5 { top: 80%; left: 10%; animation-delay: -8s; }
        .particle-6 { top: 20%; left: 70%; animation-delay: -10s; }
        .particle-7 { top: 60%; left: 85%; animation-delay: -12s; }
        .particle-8 { top: 40%; left: 15%; animation-delay: -14s; }
        .particle-9 { top: 90%; left: 50%; animation-delay: -16s; }
        .particle-10 { top: 15%; left: 45%; animation-delay: -18s; }
        .particle-11 { top: 75%; left: 75%; animation-delay: -20s; }
        .particle-12 { top: 35%; left: 5%; animation-delay: -22s; }
        .particle-13 { top: 85%; left: 90%; animation-delay: -24s; }
        .particle-14 { top: 25%; left: 35%; animation-delay: -26s; }
        .particle-15 { top: 65%; left: 95%; animation-delay: -28s; }

        @keyframes floatTreasureImg {
          0%, 100% {
            transform: translateY(0px) scale(1) rotate(0deg);
          }
          25% {
            transform: translateY(-30px) scale(1.1) rotate(5deg);
          }
          50% {
            transform: translateY(-20px) scale(0.95) rotate(-3deg);
          }
          75% {
            transform: translateY(-25px) scale(1.05) rotate(2deg);
          }
        }

        @keyframes liquidWave {
          0% {
            transform: translateX(-25%) translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateX(-50%) translateY(-15px) rotate(1deg);
          }
          50% {
            transform: translateX(-75%) translateY(-5px) rotate(-1deg);
          }
          75% {
            transform: translateX(-50%) translateY(-10px) rotate(0.5deg);
          }
          100% {
            transform: translateX(-25%) translateY(0px) rotate(0deg);
          }
        }

        @keyframes floatParticle {
          0% {
            transform: translateY(100vh) translateX(0px) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: scale(1);
          }
          90% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            transform: translateY(-100px) translateX(50px) scale(0);
            opacity: 0;
          }
        }

        @keyframes teamNameGlow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(102,126,234,0.3);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 30px rgba(102,126,234,0.6), 0 0 50px rgba(118,75,162,0.4);
            transform: scale(1.02);
          }
        }

        @keyframes formSlideIn {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .form-container {
          animation: formSlideIn 1s ease-out;
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.95);
          border-radius: 25px;
          border: 2px solid rgba(255, 215, 0, 0.2);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
          position: relative;
          overflow: hidden;
        }

        .form-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent 30%, rgba(255,215,0,0.05) 50%, transparent 70%);
          animation: shimmer 6s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%); }
          50% { transform: translateX(0%) translateY(0%); }
          100% { transform: translateX(100%) translateY(100%); }
        }

        .form-input {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 2px solid rgba(102, 126, 234, 0.3);
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          position: relative;
        }

        .form-input:focus {
          border-color: #667eea;
          background: rgba(255, 255, 255, 1);
          transform: scale(1.02);
          box-shadow: 
            0 0 0 4px rgba(102, 126, 234, 0.15),
            0 10px 25px rgba(102, 126, 234, 0.2);
        }

        .form-input[name="teamName"]:focus {
          animation: teamNameGlow 2s ease-in-out infinite;
        }

        .btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          padding: 1rem 2rem;
          border-radius: 25px;
          color: white;
          font-weight: bold;
          font-size: 1.1rem;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }

        .btn:hover::before {
          left: 100%;
        }

        .btn:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 
            0 15px 30px rgba(102, 126, 234, 0.4),
            0 0 0 1px rgba(102, 126, 234, 0.3);
        }

        .btn:active {
          transform: translateY(-1px) scale(1.02);
        }

        .success-message {
          background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1));
          border: 2px solid rgba(76, 175, 80, 0.3);
          border-radius: 20px;
          padding: 2rem;
          backdrop-filter: blur(15px);
          animation: formSlideIn 0.8s ease-out;
          position: relative;
          overflow: hidden;
        }

        .error-message {
          background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(255, 87, 34, 0.1));
          border: 2px solid rgba(244, 67, 54, 0.3);
          border-radius: 20px;
          padding: 1.5rem;
          backdrop-filter: blur(15px);
          animation: formSlideIn 0.8s ease-out;
          color: #d32f2f;
          font-weight: 500;
        }

        .form-group {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #333;
          transition: color 0.3s ease;
        }

        .form-group:focus-within label {
          color: #667eea;
          transform: translateX(5px);
        }

        @media (max-width: 768px) {
          .floating-treasure-img {
            width: 80px;
            height: 80px;
          }
          
          .pirate-ship {
            width: 120px;
            height: 80px;
          }

          .cursor-glow {
            width: 60px;
            height: 60px;
          }

          .particle {
            width: 4px;
            height: 4px;
          }
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .form-input:focus {
            transform: scale(1);
          }
          
          .btn:hover {
            transform: none;
          }
        }
      `}</style>

      <Layout 
        title="AR Treasure Hunt Registration" 
        description="Join the AR treasure hunt adventure by Curiospark"
      >
        <div className="form-container">
          {/* Show success message if team was registered */}
          {registeredTeam && (
            <div className="success-message">
              <h3 style={{
                fontSize: '2rem',
                marginBottom: '1.5rem',
                background: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center'
              }}>🏆 Crew Successfully Enlisted!</h3>
              
              <div style={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
              }}>
                <div style={{
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.7)',
                  borderRadius: '15px',
                  border: '1px solid rgba(76, 175, 80, 0.3)'
                }}>
                  <p><strong>🏴‍☠️ Crew Name:</strong> {registeredTeam.teamName}</p>
                  <p><strong>⚔️ Crew Number:</strong> #{registeredTeam.teamNumber}</p>
                </div>
                
                <div style={{
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.7)',
                  borderRadius: '15px',
                  border: '1px solid rgba(76, 175, 80, 0.3)'
                }}>
                  <p><strong>👥 Adventurers:</strong> {registeredTeam.player1} & {registeredTeam.player2}</p>
                  <p><strong>📧 Contact:</strong> {registeredTeam.email}</p>
                </div>
              </div>

              <div style={{ 
                marginTop: '2rem', 
                padding: '1.5rem', 
                background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1))', 
                borderRadius: '20px', 
                border: '2px solid rgba(255, 193, 7, 0.3)',
                textAlign: 'center'
              }}>
                <h4 style={{ 
                  margin: '0 0 1rem 0', 
                  color: '#f57f17',
                  fontSize: '1.3rem'
                }}>
                  🎮 Ready for the Adventure!
                </h4>
                <p style={{ 
                  margin: '0 0 1rem 0', 
                  fontSize: '1rem',
                  fontWeight: '500'
                }}>
                  Your unique Treasure Hunter ID: 
                  <code style={{
                    backgroundColor: '#f57f17', 
                    color: 'white', 
                    padding: '8px 16px', 
                    borderRadius: '10px', 
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    margin: '0 0.5rem',
                    display: 'inline-block',
                    boxShadow: '0 4px 10px rgba(245, 127, 23, 0.3)'
                  }}>
                    {registeredTeam.uid}
                  </code>
                </p>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.9rem',
                  fontStyle: 'italic',
                  color: '#666'
                }}>
                  Enter this ID in the AR app to begin your treasure hunting quest!
                </p>
              </div>

              <button 
                onClick={handleRegisterAnother}
                className="btn"
                style={{ marginTop: '2rem', width: '100%' }}
              >
                🏴‍☠️ Enlist Another Crew
              </button>
            </div>
          )}

          {/* Show error message if there was an error */}
          {error && (
            <div className="error-message">
              <div style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>⚠️</div>
              {error}
            </div>
          )}

          {/* Registration form - only show if no team is registered */}
          {!registeredTeam && (
            <form onSubmit={handleSubmit}>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,140,0,0.1))',
                  borderRadius: '20px',
                  padding: '2rem',
                  marginBottom: '2rem',
                  border: '2px solid rgba(255,215,0,0.2)'
                }}>
                  <h1 style={{
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    fontWeight: '600',
                    margin: '0 0 0.5rem 0',
                    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.2em' }}>🏴‍☠️</span>
                    <span style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      AR Treasure Hunt
                    </span>
                    <span style={{ fontSize: '1.2em' }}>🏴‍☠️</span>
                  </h1>
                  <p style={{ 
                    fontSize: '1.3rem', 
                    color: '#666', 
                    margin: '0 0 1rem 0',
                    fontWeight: '500'
                  }}>
                    Presented by <strong style={{ color: '#667eea' }}>Curiospark</strong>
                  </p>
                  <h2 style={{ 
                    fontSize: '1.6rem',
                    color: '#333',
                    margin: '0',
                    fontWeight: '600'
                  }}>
                    ⚔️ Assemble Your Treasure Hunting Crew
                  </h2>
                </div>
              </div>

              {/* Team Name with Special Animation */}
              <div className="form-group">
                <label htmlFor="teamName">🏴‍☠️ Crew Name *</label>
                <input
                  type="text"
                  id="teamName"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('teamName')}
                  onBlur={() => setFocusedField('')}
                  className="form-input"
                  placeholder="Enter your legendary crew name (2-30 characters)"
                  required
                  disabled={isSubmitting}
                  maxLength={30}
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    padding: '1rem 1.5rem',
                    borderRadius: '15px'
                  }}
                />
              </div>

              {/* Captain (Player 1) */}
              <div className="form-group">
                <label htmlFor="player1">👑 Captain Name *</label>
                <input
                  type="text"
                  id="player1"
                  name="player1"
                  value={formData.player1}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('player1')}
                  onBlur={() => setFocusedField('')}
                  className="form-input"
                  placeholder="Enter the captain's name"
                  required
                  disabled={isSubmitting}
                  style={{
                    fontSize: '1rem',
                    padding: '1rem 1.5rem',
                    borderRadius: '15px'
                  }}
                />
              </div>

              {/* First Mate (Player 2) */}
              <div className="form-group">
                <label htmlFor="player2">⚔️ First Mate Name *</label>
                <input
                  type="text"
                  id="player2"
                  name="player2"
                  value={formData.player2}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('player2')}
                  onBlur={() => setFocusedField('')}
                  className="form-input"
                  placeholder="Enter the first mate's name"
                  required
                  disabled={isSubmitting}
                  style={{
                    fontSize: '1rem',
                    padding: '1rem 1.5rem',
                    borderRadius: '15px'
                  }}
                />
              </div>

              {/* Crew Contact Email */}
              <div className="form-group">
                <label htmlFor="email">📧 Crew Contact Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  className="form-input"
                  placeholder="Enter crew's email address"
                  required
                  disabled={isSubmitting}
                  style={{
                    fontSize: '1rem',
                    padding: '1rem 1.5rem',
                    borderRadius: '15px'
                  }}
                />
              </div>

              {/* Communication Device (Phone) */}
              <div className="form-group">
                <label htmlFor="phoneNumber">📱 Communication Device *</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('phoneNumber')}
                  onBlur={() => setFocusedField('')}
                  className="form-input"
                  placeholder="Enter phone number (e.g., +1234567890)"
                  required
                  disabled={isSubmitting}
                  style={{
                    fontSize: '1rem',
                    padding: '1rem 1.5rem',
                    borderRadius: '15px'
                  }}
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  fontSize: '1.2rem',
                  padding: '1.2rem 2rem',
                  marginTop: '1rem'
                }}
              >
                {isSubmitting ? '🗺️ Preparing Your Adventure...' : '⚔️ Enlist Crew & Begin Adventure'}
              </button>
            </form>
          )}

          {/* Adventure Instructions */}
          <div style={{ 
            marginTop: '3rem', 
            padding: '2rem', 
            background: 'linear-gradient(135deg, rgba(72,209,204,0.1), rgba(67,160,71,0.1))', 
            borderRadius: '20px',
            border: '2px solid rgba(72,209,204,0.3)'
          }}>
            <h4 style={{ 
              marginBottom: '1.5rem', 
              color: '#00695C',
              fontSize: '1.4rem',
              textAlign: 'center'
            }}>🗺️ Your Treasure Hunting Quest Begins Here!</h4>
            <div style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
            }}>
              <div style={{
                padding: '1rem',
                background: 'rgba(255,255,255,0.7)',
                borderRadius: '15px',
                border: '1px solid rgba(72,209,204,0.3)'
              }}>
                <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🏴‍☠️</div>
                <p style={{margin: '0', fontWeight: '500'}}>
                  <strong>Assemble Your Crew:</strong> Choose a legendary name and recruit your bravest adventurers
                </p>
              </div>
              
              <div style={{
                padding: '1rem',
                background: 'rgba(255,255,255,0.7)',
                borderRadius: '15px',
                border: '1px solid rgba(72,209,204,0.3)'
              }}>
                <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📱</div>
                <p style={{margin: '0', fontWeight: '500'}}>
                  <strong>Establish Communication:</strong> Provide contact details for quest updates and treasure alerts
                </p>
              </div>
              
              <div style={{
                padding: '1rem',
                background: 'rgba(255,255,255,0.7)',
                borderRadius: '15px',
                border: '1px solid rgba(72,209,204,0.3)'
              }}>
                <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🗝️</div>
                <p style={{margin: '0', fontWeight: '500'}}>
                  <strong>Receive Your Key:</strong> Get your unique Treasure Hunter ID to unlock the AR realm
                </p>
              </div>
              
              <div style={{
                padding: '1rem',
                background: 'rgba(255,255,255,0.7)',
                borderRadius: '15px',
                border: '1px solid rgba(72,209,204,0.3)'
              }}>
                <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🎮</div>
                <p style={{margin: '0', fontWeight: '500'}}>
                  <strong>Begin the Hunt:</strong> Enter your ID in the AR app and start discovering ancient treasures
                </p>
              </div>
              
              <div style={{
                padding: '1rem',
                background: 'rgba(255,255,255,0.7)',
                borderRadius: '15px',
                border: '1px solid rgba(72,209,204,0.3)'
              }}>
                <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🏆</div>
                <p style={{margin: '0', fontWeight: '500'}}>
                  <strong>Claim Glory:</strong> Watch the live leaderboard as you collect treasures and climb the ranks!
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}