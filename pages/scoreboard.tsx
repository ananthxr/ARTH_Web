// Live AR Treasure Hunt Scoreboard
// Real-time leaderboard for Curiospark's AR Treasure Hunt

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { subscribeToScoreboard, type Team } from '@/lib/firestore';

export default function Scoreboard() {
  // State to store teams data
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [newScoreAnimation, setNewScoreAnimation] = useState<string>('');
  const [scrollY, setScrollY] = useState(0);
  const previousScores = useRef<Map<string, number>>(new Map());

  // Handle scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;

    const setupListener = () => {
      try {
        console.log('Setting up scoreboard listener...');
        
        // Set up real-time listener for scoreboard updates
        const unsubscribe = subscribeToScoreboard((updatedTeams) => {
          console.log('Scoreboard updated:', updatedTeams);
          
          // Check for score changes to trigger animations
          updatedTeams.forEach(team => {
            const previousScore = previousScores.current.get(team.teamName) || 0;
            if (team.score > previousScore) {
              setNewScoreAnimation(team.teamName);
              setTimeout(() => setNewScoreAnimation(''), 3000);
            }
            previousScores.current.set(team.teamName, team.score);
          });

          setTeams(updatedTeams);
          setIsLoading(false);
          setLastUpdated(new Date());
          setError('');
          setConnectionStatus('connected');
          retryCount = 0; // Reset retry count on success
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error setting up listener:', error);
        setConnectionStatus('error');
        
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(setupListener, 2000 * retryCount);
        } else {
          setError('Failed to connect to live updates. Please refresh the page.');
          setIsLoading(false);
        }
      }
    };

    const unsubscribe = setupListener();

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Format the last updated time
  const formatLastUpdated = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      {/* Animated Background with Large Treasure Images */}
      <div className="treasure-background">
        {/* Large Treasure Images */}
        <div className="floating-treasure-large treasure-chest-large" 
             style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 150'%3E%3Cdefs%3E%3ClinearGradient id='chest' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' style='stop-color:%23D4AF37'/%3E%3Cstop offset='100%25' style='stop-color:%23B8860B'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='20' y='60' width='160' height='80' fill='url(%23chest)' rx='10'/%3E%3Crect x='30' y='40' width='140' height='50' fill='%23DAA520' rx='10'/%3E%3Ccircle cx='100' cy='90' r='8' fill='%23FFD700'/%3E%3C/svg%3E")`}}>
        </div>

        <div className="floating-treasure-large diamond-large"
             style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='diamond' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' style='stop-color:%2300BFFF'/%3E%3Cstop offset='50%25' style='stop-color:%230080FF'/%3E%3Cstop offset='100%25' style='stop-color:%23004080'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpolygon points='60,20 90,50 60,100 30,50' fill='url(%23diamond)' stroke='%23000080' stroke-width='3'/%3E%3Cpolygon points='45,35 60,20 75,35 60,50' fill='%23FFFFFF' opacity='0.4'/%3E%3C/svg%3E")`}}>
        </div>

        <div className="floating-treasure-large pirate-ship-large"
             style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Cdefs%3E%3ClinearGradient id='ship' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' style='stop-color:%238B4513'/%3E%3Cstop offset='100%25' style='stop-color:%23654321'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M50 150 Q150 120 250 150 L240 130 Q150 100 60 130 Z' fill='url(%23ship)'/%3E%3Crect x='140' y='60' width='6' height='70' fill='%23654321'/%3E%3Cpolygon points='120,60 120,100 180,80' fill='%23FFFACD'/%3E%3Ctext x='150' y='45' fill='%23000' font-size='20'%3E⚡%3C/text%3E%3C/svg%3E")`}}>
        </div>

        <div className="floating-treasure-large treasure-map-large"
             style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 150'%3E%3Cdefs%3E%3ClinearGradient id='paper' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' style='stop-color:%23F4E4BC'/%3E%3Cstop offset='100%25' style='stop-color:%23DEB887'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='20' y='20' width='160' height='110' fill='url(%23paper)' rx='5'/%3E%3Cpath d='M40 50 Q80 40 120 50 T160 50' stroke='%23654321' stroke-width='2' fill='none'/%3E%3Ccircle cx='140' cy='80' r='8' fill='%23FF0000' opacity='0.7'/%3E%3Ctext x='135' y='85' fill='%23FFFFFF' font-size='12'%3EX%3C/text%3E%3C/svg%3E")`}}>
        </div>

        <div className="floating-treasure-large compass-large"
             style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 150'%3E%3Cdefs%3E%3CradialGradient id='compass' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' style='stop-color:%23FFD700'/%3E%3Cstop offset='100%25' style='stop-color:%23B8860B'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='75' cy='75' r='60' fill='url(%23compass)' stroke='%23654321' stroke-width='4'/%3E%3Cpolygon points='75,25 85,65 75,70 65,65' fill='%23FF0000'/%3E%3Cpolygon points='75,80 85,85 75,125 65,85' fill='%23FFFFFF'/%3E%3Ctext x='75' y='20' text-anchor='middle' fill='%23654321' font-size='14' font-weight='bold'%3EN%3C/text%3E%3C/svg%3E")`}}>
        </div>

        <div className="floating-treasure-large anchor-large"
             style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 150'%3E%3Cdefs%3E%3ClinearGradient id='anchor' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' style='stop-color:%23708090'/%3E%3Cstop offset='100%25' style='stop-color:%232F4F4F'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='60' cy='30' r='15' fill='none' stroke='url(%23anchor)' stroke-width='6'/%3E%3Crect x='57' y='45' width='6' height='60' fill='url(%23anchor)'/%3E%3Cpath d='M30 120 Q60 100 90 120 Q75 105 60 105 Q45 105 30 120' fill='url(%23anchor)'/%3E%3C/svg%3E")`}}>
        </div>

        <div className="treasure-map-bg"></div>
        <div className="ocean-waves"></div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          font-size: 16px;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }

        body {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #3d4e81 50%, #5f2c82 75%, #49a09d 100%);
          background-attachment: fixed;
          min-height: 100vh;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
          font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
        }

        /* Mobile-specific background fix */
        @media (max-width: 768px) {
          body {
            background-attachment: scroll;
          }
        }

        .treasure-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: -2;
          overflow: hidden;
        }

        .treasure-map-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 80%, rgba(255,215,0,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,140,0,0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(139,69,19,0.1) 0%, transparent 50%);
          animation: mapShift 20s ease-in-out infinite alternate;
        }

        .ocean-waves {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 100px;
          background: linear-gradient(90deg, 
            rgba(0,119,190,0.3) 0%,
            rgba(0,180,216,0.3) 25%, 
            rgba(0,119,190,0.3) 50%,
            rgba(0,180,216,0.3) 75%,
            rgba(0,119,190,0.3) 100%);
          animation: waves 8s ease-in-out infinite;
          opacity: 0.6;
        }

        .floating-treasure-large {
          position: absolute;
          width: 150px;
          height: 150px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          filter: drop-shadow(0 10px 25px rgba(0,0,0,0.4));
          animation: floatTreasureLarge 8s ease-in-out infinite;
          opacity: 0.8;
        }

        .treasure-chest-large {
          top: 15%;
          left: 8%;
          animation-delay: 0s;
          animation-duration: 12s;
        }

        .diamond-large {
          top: 25%;
          right: 12%;
          animation-delay: 2s;
          animation-duration: 10s;
        }

        .pirate-ship-large {
          top: 60%;
          right: 5%;
          width: 200px;
          height: 150px;
          animation-delay: 4s;
          animation-duration: 20s;
        }

        .treasure-map-large {
          bottom: 25%;
          left: 12%;
          animation-delay: 6s;
          animation-duration: 14s;
        }

        .compass-large {
          top: 40%;
          right: 25%;
          animation-delay: 8s;
          animation-duration: 16s;
        }

        .anchor-large {
          bottom: 15%;
          left: 70%;
          animation-delay: 10s;
          animation-duration: 18s;
        }

        @keyframes floatTreasure {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-20px) rotate(90deg) scale(1.1);
          }
          50% {
            transform: translateY(-10px) rotate(180deg) scale(0.9);
          }
          75% {
            transform: translateY(-15px) rotate(270deg) scale(1.05);
          }
        }

        @keyframes floatTreasureLarge {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
            filter: drop-shadow(0 10px 25px rgba(0,0,0,0.4));
          }
          25% {
            transform: translateY(-30px) rotate(5deg) scale(1.15);
            filter: drop-shadow(0 20px 35px rgba(0,0,0,0.5));
          }
          50% {
            transform: translateY(-20px) rotate(-3deg) scale(0.9);
            filter: drop-shadow(0 15px 30px rgba(0,0,0,0.45));
          }
          75% {
            transform: translateY(-25px) rotate(8deg) scale(1.1);
            filter: drop-shadow(0 18px 32px rgba(0,0,0,0.48));
          }
        }

        @keyframes sailShip {
          0% {
            left: -10%;
            transform: translateY(0px);
          }
          25% {
            transform: translateY(-10px);
          }
          50% {
            transform: translateY(5px);
          }
          75% {
            transform: translateY(-5px);
          }
          100% {
            left: 110%;
            transform: translateY(0px);
          }
        }

        @keyframes spinCompass {
          0% {
            transform: rotate(0deg) scale(1);
          }
          25% {
            transform: rotate(90deg) scale(1.1);
          }
          50% {
            transform: rotate(180deg) scale(1);
          }
          75% {
            transform: rotate(270deg) scale(0.9);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        @keyframes waves {
          0%, 100% {
            transform: translateX(-25%) translateY(0px);
          }
          50% {
            transform: translateX(-75%) translateY(-10px);
          }
        }

        @keyframes mapShift {
          0% {
            transform: translateX(0%) translateY(0%);
          }
          100% {
            transform: translateX(-5%) translateY(-3%);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        
        @keyframes treasureGlow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
            transform: scale(1);
          }
          25% {
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 140, 0, 0.6);
            transform: scale(1.05) rotateY(10deg);
          }
          50% {
            box-shadow: 0 0 60px rgba(255, 215, 0, 1), 0 0 80px rgba(255, 140, 0, 0.8);
            transform: scale(1.1) rotateY(0deg);
          }
          75% {
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 140, 0, 0.6);
            transform: scale(1.05) rotateY(-10deg);
          }
        }
        
        @keyframes slideInUp {
          from {
            transform: translateY(50px) rotateX(-10deg);
            opacity: 0;
          }
          to {
            transform: translateY(0) rotateX(0deg);
            opacity: 1;
          }
        }

        @keyframes cardHover {
          from {
            transform: translateY(0) scale(1);
          }
          to {
            transform: translateY(-10px) scale(1.02);
          }
        }
        
        .team-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation: slideInUp 0.6s ease-out;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          position: relative;
          overflow: hidden;
        }

        .team-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .team-card:hover::before {
          left: 100%;
        }
        
        .team-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 
            0 25px 50px rgba(0,0,0,0.3),
            0 0 0 1px rgba(255,215,0,0.2),
            inset 0 0 20px rgba(255,215,0,0.1);
        }
        
        .treasure-updated {
          animation: treasureGlow 3s ease-in-out;
        }

        .parallax-element {
          transform: translateY(${scrollY * 0.1}px);
        }

        .rank-badge {
          transition: all 0.3s ease;
          background: rgba(255,255,255,0.15) !important;
          backdrop-filter: blur(15px);
          box-shadow: 
            inset 0 1px 0 rgba(255,255,255,0.3),
            0 4px 15px rgba(0,0,0,0.2);
        }

        .rank-badge:hover {
          transform: scale(1.1) rotate(5deg);
          background: rgba(255,255,255,0.25) !important;
        }

        .treasure-particle {
          position: absolute;
          pointer-events: none;
          font-size: 1rem;
          animation: particleFloat 4s ease-out forwards;
        }

        @keyframes particleFloat {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(0.5) rotate(360deg);
            opacity: 0;
          }
        }

        .glowing-text {
          text-shadow: 
            0 0 10px rgba(255,215,0,0.3),
            0 0 20px rgba(255,215,0,0.2),
            0 0 30px rgba(255,215,0,0.1);
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .floating-treasure-large {
            width: 80px;
            height: 80px;
          }
          
          .pirate-ship-large {
            width: 100px;
            height: 80px;
          }

          .treasure-chest-large {
            left: 3%;
            top: 12%;
          }

          .diamond-large {
            right: 3%;
            top: 20%;
          }

          .compass-large {
            right: 12%;
            top: 35%;
          }

          .anchor-large {
            left: 65%;
            bottom: 12%;
          }

          .treasure-map-large {
            left: 8%;
            bottom: 20%;
          }

          .pirate-ship-large {
            right: 3%;
            top: 58%;
          }

          /* Make containers mobile-friendly */
          .parallax-element {
            transform: none !important; /* Disable parallax on mobile */
            margin: 0.5rem;
            padding: 1.5rem !important;
          }

          /* Team cards mobile optimization */
          .team-card {
            margin: 0 0.5rem 1rem 0.5rem;
            padding: 1.5rem 1rem;
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          /* Responsive grid for stats */
          .stats-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 1rem;
          }

          /* Mobile-friendly text sizes */
          h1 {
            font-size: clamp(1.5rem, 4vw, 2.5rem) !important;
          }

          h2 {
            font-size: clamp(1.2rem, 3vw, 1.8rem) !important;
          }

          h3 {
            font-size: clamp(1.1rem, 2.5vw, 1.5rem) !important;
          }
        }

        @media (max-width: 480px) {
          .floating-treasure-large {
            width: 60px;
            height: 60px;
          }
          
          .pirate-ship-large {
            width: 80px;
            height: 60px;
          }

          .parallax-element {
            margin: 0.25rem;
            padding: 1rem !important;
          }

          .team-card {
            margin: 0 0.25rem 0.75rem 0.25rem;
            padding: 1rem 0.75rem;
          }

          /* Even smaller treasure elements on very small screens */
          .treasure-chest-large {
            left: 2%;
          }

          .diamond-large {
            right: 2%;
          }

          .anchor-large {
            left: 70%;
          }
        }
      `}</style>

      <Layout 
        title="AR Treasure Hunt - Live Leaderboard" 
        description="Real-time AR treasure hunt leaderboard by Curiospark"
      >
        {/* Treasure Hunt Header */}
        <div className="parallax-element" style={{ 
          background: 'linear-gradient(135deg, rgba(139,69,19,0.9) 0%, rgba(160,82,45,0.9) 50%, rgba(139,69,19,0.9) 100%)',
          padding: '3rem 2rem',
          borderRadius: '25px',
          marginBottom: '2rem',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 30px 60px rgba(0,0,0,0.4), inset 0 0 30px rgba(255,215,0,0.1)',
          border: '2px solid rgba(255,215,0,0.3)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '2rem',
            animation: 'spinCompass 8s linear infinite'
          }}>🧭</div>
          
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            fontSize: '1.5rem',
            animation: 'floatTreasure 5s ease-in-out infinite'
          }}>🗝️</div>

          <h1 className="glowing-text" style={{ 
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
            fontWeight: '600',
            margin: '0 0 1rem 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(102,126,234,0.3)',
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
            letterSpacing: '0.5px'
          }}>
            🏴‍☠️ AR TREASURE HUNT LEADERBOARD 🏴‍☠️
          </h1>
          <p style={{ 
            fontSize: '1.3rem',
            margin: '0 0 1.5rem 0',
            opacity: 0.95,
            fontWeight: '500'
          }}>
            ⚔️ Presented by <strong style={{color: '#FFD700'}}>Curiospark</strong> AR Adventures ⚔️
          </p>
          
          {/* Enhanced Live Status */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '1rem',
            padding: '1rem 2rem',
            background: connectionStatus === 'connected' ? 
              'linear-gradient(135deg, rgba(76, 175, 80, 0.3), rgba(139, 195, 74, 0.3))' : 
              connectionStatus === 'error' ? 
              'linear-gradient(135deg, rgba(244, 67, 54, 0.3), rgba(255, 87, 34, 0.3))' : 
              'linear-gradient(135deg, rgba(255, 193, 7, 0.3), rgba(255, 152, 0, 0.3))',
            borderRadius: '30px',
            fontSize: '1.1rem',
            color: 'white',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
          }}>
            <span style={{ 
              width: '15px', 
              height: '15px', 
              background: connectionStatus === 'connected' ? '#4caf50' : 
                         connectionStatus === 'error' ? '#f44336' : '#ff9800', 
              borderRadius: '50%',
              display: 'inline-block',
              animation: connectionStatus === 'connecting' ? 'pulse 1.5s infinite' : 
                        connectionStatus === 'connected' ? 'pulse 2s infinite' : 'none',
              boxShadow: `0 0 10px ${connectionStatus === 'connected' ? '#4caf50' : 
                                   connectionStatus === 'error' ? '#f44336' : '#ff9800'}`
            }}></span>
            <span style={{fontWeight: 'bold'}}>
              {connectionStatus === 'connected' && '🔴 LIVE TREASURE TRACKING'}
              {connectionStatus === 'connecting' && '🟡 CONNECTING TO TREASURE REALM...'}
              {connectionStatus === 'error' && '🔴 LOST CONNECTION TO TREASURE REALM'}
            </span>
          </div>
          
          {!isLoading && connectionStatus === 'connected' && (
            <p style={{ marginTop: '1rem', fontSize: '1rem', opacity: 0.9, fontStyle: 'italic' }}>
              ⚡ Treasure map last updated: <strong>{formatLastUpdated(lastUpdated)}</strong>
            </p>
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '5rem 2rem',
            background: 'linear-gradient(135deg, rgba(255,140,0,0.9) 0%, rgba(255,193,7,0.9) 50%, rgba(255,140,0,0.9) 100%)',
            borderRadius: '25px',
            color: 'white',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255,215,0,0.3)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              margin: '0 auto 2rem auto',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 150'%3E%3Cdefs%3E%3ClinearGradient id='paper' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' style='stop-color:%23F4E4BC'/%3E%3Cstop offset='100%25' style='stop-color:%23DEB887'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='20' y='20' width='160' height='110' fill='url(%23paper)' rx='5'/%3E%3Cpath d='M40 50 Q80 40 120 50 T160 50' stroke='%23654321' stroke-width='2' fill='none'/%3E%3Ccircle cx='140' cy='80' r='8' fill='%23FF0000' opacity='0.7'/%3E%3Ctext x='135' y='85' fill='%23FFFFFF' font-size='12'%3EX%3C/text%3E%3C/svg%3E")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              animation: 'pulse 2s infinite',
              filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))'
            }}></div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '2rem', fontWeight: 'bold' }}>
              Deciphering Ancient Treasure Maps...
            </h3>
            <p style={{ margin: '0', opacity: 0.95, fontSize: '1.2rem' }}>
              The mystical compass is aligning with the treasure coordinates...
            </p>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              margin: '2rem auto 0 auto',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 150'%3E%3Cdefs%3E%3CradialGradient id='compass' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' style='stop-color:%23FFD700'/%3E%3Cstop offset='100%25' style='stop-color:%23B8860B'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='75' cy='75' r='60' fill='url(%23compass)' stroke='%23654321' stroke-width='4'/%3E%3Cpolygon points='75,25 85,65 75,70 65,65' fill='%23FF0000'/%3E%3Cpolygon points='75,80 85,85 75,125 65,85' fill='%23FFFFFF'/%3E%3Ctext x='75' y='20' text-anchor='middle' fill='%23654321' font-size='14' font-weight='bold'%3EN%3C/text%3E%3C/svg%3E")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              animation: 'spinCompass 3s linear infinite',
              filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))'
            }}></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div style={{ 
            padding: '3rem 2rem',
            background: 'linear-gradient(135deg, rgba(220,20,60,0.9) 0%, rgba(178,34,34,0.9) 100%)',
            borderRadius: '25px',
            color: 'white',
            textAlign: 'center',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>⚠️</div>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.8rem' }}>The Treasure Realm is Unreachable!</h3>
            <p style={{ margin: '0', opacity: 0.95, fontSize: '1.1rem' }}>{error}</p>
          </div>
        )}

        {/* Treasure Hunters Leaderboard */}
        {!isLoading && !error && (
          <div>
            {teams.length === 0 ? (
              <div style={{ 
                padding: '5rem 2rem', 
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(72,209,204,0.9) 0%, rgba(67,160,71,0.9) 50%, rgba(72,209,204,0.9) 100%)',
                borderRadius: '25px',
                color: 'white',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255,255,255,0.2)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
              }}>
                <div style={{ fontSize: '5rem', marginBottom: '2rem', animation: 'floatTreasure 4s ease-in-out infinite' }}>🏴‍☠️</div>
                <h3 style={{ margin: '0 0 2rem 0', fontSize: '2.5rem', fontWeight: 'bold' }}>
                  The Great Treasure Hunt Awaits!
                </h3>
                <p style={{ margin: '0', fontSize: '1.3rem', opacity: 0.95 }}>
                  No brave treasure hunters have set sail yet...<br/>
                  <strong>Be the first crew to embark on this epic adventure!</strong>
                </p>
                <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '2rem'}}>
                  <span style={{animation: 'floatTreasure 3s ease-in-out infinite'}}>⚓</span>
                  <span style={{animation: 'floatTreasure 3s ease-in-out infinite', animationDelay: '1s'}}>🗝️</span>
                  <span style={{animation: 'floatTreasure 3s ease-in-out infinite', animationDelay: '2s'}}>💰</span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {teams.map((team, index) => {
                  const isTopThree = index < 3 && team.score > 0;
                  const isWinner = index === 0 && team.score > 0;
                  
                  const getRankGradient = () => {
                    if (isWinner) return 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)';
                    if (index === 1) return 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 50%, #808080 100%)';
                    if (index === 2) return 'linear-gradient(135deg, #CD7F32 0%, #B8860B 50%, #8B4513 100%)';
                    return 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 50%, rgba(102, 126, 234, 0.9) 100%)';
                  };
                  
                  return (
                    <div 
                      key={team.teamName}
                      className={`team-card ${newScoreAnimation === team.teamName ? 'treasure-updated' : ''}`}
                      style={{
                        background: getRankGradient(),
                        padding: '2rem',
                        borderRadius: '25px',
                        color: 'white',
                        boxShadow: isWinner ? 
                          '0 20px 40px rgba(255,215,0,0.4), 0 0 0 2px rgba(255,215,0,0.3)' :
                          '0 15px 35px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem',
                        position: 'relative',
                        overflow: 'hidden',
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      {/* Rank Badge */}
                      <div className="rank-badge" style={{
                        borderRadius: '50%',
                        width: '90px',
                        height: '90px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        border: '3px solid rgba(255,255,255,0.4)'
                      }}>
                        {isTopThree ? (
                          <span style={{ fontSize: '2.5rem' }}>
                            {index === 0 ? '👑' : index === 1 ? '⭐' : '🥉'}
                          </span>
                        ) : (
                          <span style={{fontSize: '1.3rem', fontWeight: 'bold'}}>#{index + 1}</span>
                        )}
                      </div>

                      {/* Team Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                          <h3 className="glowing-text" style={{ 
                            margin: '0',
                            fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
                            fontWeight: 'bold',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                          }}>
                            🏴‍☠️ {team.teamName}
                          </h3>
                          <span style={{
                            background: 'rgba(255,255,255,0.25)',
                            padding: '0.4rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)'
                          }}>
                            ⚔️ Crew #{team.teamNumber}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <div>
                            <p style={{ margin: '0', fontSize: '1.1rem', opacity: 0.95, fontWeight: '500' }}>
                              👥 Captain <strong>{team.player1}</strong> & First Mate <strong>{team.player2}</strong>
                            </p>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.8, fontStyle: 'italic' }}>
                              🗓️ Enlisted: {new Date(team.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Score Display */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          background: 'rgba(255,255,255,0.2)',
                          borderRadius: '20px',
                          padding: '1.5rem 2rem',
                          backdropFilter: 'blur(15px)',
                          border: '2px solid rgba(255,255,255,0.3)',
                          boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.1)',
                          position: 'relative'
                        }}>
                          <div style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '-10px',
                            fontSize: '1.5rem',
                            animation: 'floatTreasure 3s ease-in-out infinite'
                          }}>💰</div>
                          
                          <p style={{ 
                            margin: '0 0 0.5rem 0', 
                            fontSize: '1rem', 
                            opacity: 0.9,
                            fontWeight: 'bold'
                          }}>
                            🏆 TREASURE HAUL
                          </p>
                          <p className="glowing-text" style={{ 
                            margin: '0',
                            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', 
                            fontWeight: 'bold',
                            textShadow: '3px 3px 6px rgba(0,0,0,0.4)'
                          }}>
                            {team.score.toLocaleString()}
                          </p>
                          <p style={{ 
                            margin: '0.5rem 0 0 0', 
                            fontSize: '0.9rem', 
                            opacity: 0.9,
                            fontWeight: '500'
                          }}>
                            doubloons
                          </p>
                        </div>
                      </div>

                      {/* Decorative treasure particles */}
                      {isWinner && (
                        <>
                          <div style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            fontSize: '1.5rem',
                            animation: 'floatTreasure 4s ease-in-out infinite'
                          }}>💎</div>
                          <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '20px',
                            fontSize: '1.2rem',
                            animation: 'floatTreasure 5s ease-in-out infinite',
                            animationDelay: '2s'
                          }}>🔮</div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Enhanced Stats Treasure Chest */}
        {!isLoading && teams.length > 0 && (
          <div className="parallax-element" style={{ 
            marginTop: '4rem', 
            padding: '3rem 2rem',
            background: 'linear-gradient(135deg, rgba(139,69,19,0.95) 0%, rgba(160,82,45,0.95) 50%, rgba(139,69,19,0.95) 100%)',
            borderRadius: '25px',
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4), inset 0 0 30px rgba(255,215,0,0.1)',
            border: '2px solid rgba(255,215,0,0.3)',
            backdropFilter: 'blur(20px)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '15px',
              left: '15px',
              fontSize: '2rem',
              animation: 'floatTreasure 6s ease-in-out infinite'
            }}>🏺</div>

            <h3 className="glowing-text" style={{
              fontSize: '2rem',
              marginBottom: '2rem',
              fontWeight: 'bold'
            }}>🗝️ TREASURE VAULT STATISTICS 🗝️</h3>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                padding: '2rem',
                borderRadius: '20px',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(255,215,0,0.2)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚔️</div>
                <p style={{ margin: '0', fontSize: '2.5rem', fontWeight: 'bold', color: '#FFD700' }}>
                  {teams.length}
                </p>
                <p style={{ margin: '0', fontSize: '1.1rem', opacity: 0.9 }}>
                  Brave Treasure Crews
                </p>
              </div>
              
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                padding: '2rem',
                borderRadius: '20px',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(255,215,0,0.2)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
                <p style={{ margin: '0', fontSize: '2.5rem', fontWeight: 'bold', color: '#FFD700' }}>
                  {teams.reduce((total, team) => total + team.score, 0).toLocaleString()}
                </p>
                <p style={{ margin: '0', fontSize: '1.1rem', opacity: 0.9 }}>
                  Total Doubloons Collected
                </p>
              </div>
              
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                padding: '2rem',
                borderRadius: '20px',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(255,215,0,0.2)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔥</div>
                <p style={{ margin: '0', fontSize: '2.5rem', fontWeight: 'bold', color: '#FF6B6B' }}>
                  LIVE
                </p>
                <p style={{ margin: '0', fontSize: '1.1rem', opacity: 0.9 }}>
                  Real-Time Adventure
                </p>
              </div>
            </div>
            
            <div style={{ 
              padding: '2rem',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '20px',
              backdropFilter: 'blur(15px)',
              border: '2px solid rgba(255,215,0,0.2)'
            }}>
              <p className="glowing-text" style={{ margin: '0 0 1rem 0', fontSize: '1.3rem', fontWeight: 'bold' }}>
                🌟 Powered by Curiospark AR Magic 🌟
              </p>
              <p style={{ margin: '0', fontSize: '1.1rem', opacity: 0.95, fontStyle: 'italic' }}>
                Embark on the ultimate AR treasure hunting adventure! Watch as brave crews discover ancient treasures in real-time across mystical realms.
              </p>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
}