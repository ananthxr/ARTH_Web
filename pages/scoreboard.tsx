// Live AR Treasure Hunt Scoreboard
// Real-time leaderboard for Curiospark's AR Treasure Hunt

import { useState, useEffect, useRef } from 'react';
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
  const previousScores = useRef<Map<string, number>>(new Map());

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
              setTimeout(() => setNewScoreAnimation(''), 2000);
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
    <Layout 
      title="AR Treasure Hunt - Live Leaderboard" 
      description="Real-time AR treasure hunt leaderboard by Curiospark"
    >
      {/* Header Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        borderRadius: '20px',
        marginBottom: '2rem',
        color: 'white',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold',
          margin: '0 0 0.5rem 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🏴‍☠️ AR Treasure Hunt
        </h1>
        <p style={{ 
          fontSize: '1.2rem',
          margin: '0 0 1rem 0',
          opacity: 0.9
        }}>
          Presented by <strong>Curiospark</strong>
        </p>
        
        {/* Live Status Indicator */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          padding: '0.75rem 1.5rem',
          background: connectionStatus === 'connected' ? 'rgba(76, 175, 80, 0.2)' : 
                     connectionStatus === 'error' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(255, 193, 7, 0.2)',
          borderRadius: '25px',
          fontSize: '1rem',
          color: 'white',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <span style={{ 
            width: '12px', 
            height: '12px', 
            background: connectionStatus === 'connected' ? '#4caf50' : 
                       connectionStatus === 'error' ? '#f44336' : '#ff9800', 
            borderRadius: '50%',
            display: 'inline-block',
            animation: connectionStatus === 'connecting' ? 'pulse 1.5s infinite' : 'none'
          }}></span>
          {connectionStatus === 'connected' && '🔴 LIVE'}
          {connectionStatus === 'connecting' && '🟡 CONNECTING...'}
          {connectionStatus === 'error' && '🔴 CONNECTION ERROR'}
        </div>
        
        {!isLoading && connectionStatus === 'connected' && (
          <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', opacity: 0.8 }}>
            ⚡ Last updated: {formatLastUpdated(lastUpdated)}
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes scoreGlow {
          0%, 100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
          50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.6); }
        }
        
        @keyframes slideInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .team-card {
          transition: all 0.3s ease;
          animation: slideInUp 0.5s ease-out;
        }
        
        .team-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
        
        .score-updated {
          animation: scoreGlow 2s ease-in-out;
        }
      `}</style>

      {/* Loading state */}
      {isLoading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
          borderRadius: '20px',
          color: 'white'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>
            Loading Treasure Map...
          </h3>
          <p style={{ margin: '0', opacity: 0.9 }}>
            Gathering adventurer data from the mystical realms...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div style={{ 
          padding: '2rem',
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          borderRadius: '20px',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Connection Lost to Treasure Realm</h3>
          <p style={{ margin: '0', opacity: 0.9 }}>{error}</p>
        </div>
      )}

      {/* Leaderboard Cards */}
      {!isLoading && !error && (
        <div>
          {teams.length === 0 ? (
            <div style={{ 
              padding: '4rem 2rem', 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              borderRadius: '20px',
              color: '#333'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏴‍☠️</div>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.8rem' }}>
                The Hunt Awaits!
              </h3>
              <p style={{ margin: '0', fontSize: '1.1rem', opacity: 0.8 }}>
                No brave adventurers have joined the quest yet.<br/>
                Be the first to register your crew!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {teams.map((team, index) => {
                const isTopThree = index < 3 && team.score > 0;
                const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // Gold, Silver, Bronze
                const rankIcons = ['👑', '⭐', '🥉'];
                
                return (
                  <div 
                    key={team.teamName}
                    className={`team-card ${newScoreAnimation === team.teamName ? 'score-updated' : ''}`}
                    style={{
                      background: index === 0 && team.score > 0 ? 
                        'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' :
                        isTopThree ? 
                        `linear-gradient(135deg, ${rankColors[index]} 0%, ${rankColors[index]}CC 100%)` :
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      padding: '1.5rem',
                      borderRadius: '20px',
                      color: 'white',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Rank Badge */}
                    <div style={{
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      width: '80px',
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255,255,255,0.3)'
                    }}>
                      {isTopThree ? (
                        <span style={{ fontSize: '2rem' }}>
                          {index === 0 ? '👑' : index === 1 ? '⭐' : '🥉'}
                        </span>
                      ) : (
                        <span>#{index + 1}</span>
                      )}
                    </div>

                    {/* Team Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ 
                          margin: '0',
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                        }}>
                          🏴‍☠️ {team.teamName}
                        </h3>
                        <span style={{
                          background: 'rgba(255,255,255,0.2)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '15px',
                          fontSize: '0.9rem',
                          fontWeight: 'bold'
                        }}>
                          Team #{team.teamNumber}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div>
                          <p style={{ margin: '0', fontSize: '1rem', opacity: 0.9 }}>
                            👥 <strong>{team.player1}</strong> & <strong>{team.player2}</strong>
                          </p>
                          <p style={{ 
                            margin: '0.25rem 0 0 0', 
                            fontSize: '0.8rem', 
                            opacity: 0.7,
                            fontFamily: 'monospace'
                          }}>
                            🔑 UID: {team.uid}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Score Display */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '15px',
                        padding: '1rem 1.5rem',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255,255,255,0.3)'
                      }}>
                        <p style={{ 
                          margin: '0 0 0.25rem 0', 
                          fontSize: '0.9rem', 
                          opacity: 0.8,
                          fontWeight: 'bold'
                        }}>
                          🏆 TREASURE
                        </p>
                        <p style={{ 
                          margin: '0',
                          fontSize: '2rem', 
                          fontWeight: 'bold',
                          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                        }}>
                          {team.score.toLocaleString()}
                        </p>
                        <p style={{ 
                          margin: '0.25rem 0 0 0', 
                          fontSize: '0.8rem', 
                          opacity: 0.8
                        }}>
                          points
                        </p>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div style={{
                      position: 'absolute',
                      top: '-50px',
                      right: '-50px',
                      width: '100px',
                      height: '100px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '50%',
                      opacity: 0.5
                    }}></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Stats Footer */}
      {!isLoading && teams.length > 0 && (
        <div style={{ 
          marginTop: '3rem', 
          padding: '2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚔️</div>
              <p style={{ margin: '0', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {teams.length}
              </p>
              <p style={{ margin: '0', fontSize: '0.9rem', opacity: 0.8 }}>
                Brave Crews
              </p>
            </div>
            
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💎</div>
              <p style={{ margin: '0', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {teams.reduce((total, team) => total + team.score, 0).toLocaleString()}
              </p>
              <p style={{ margin: '0', fontSize: '0.9rem', opacity: 0.8 }}>
                Total Treasures
              </p>
            </div>
            
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔥</div>
              <p style={{ margin: '0', fontSize: '1.5rem', fontWeight: 'bold' }}>
                LIVE
              </p>
              <p style={{ margin: '0', fontSize: '0.9rem', opacity: 0.8 }}>
                Real-Time Updates
              </p>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <p style={{ margin: '0', fontSize: '1rem', fontWeight: 'bold' }}>
              🌟 Powered by Curiospark AR Technology 🌟
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
              Adventure awaits in the digital realm! Scores refresh automatically as treasures are discovered.
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
}