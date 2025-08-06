// Live Scoreboard Page
// This page displays all teams and their scores in real-time using Firebase listeners

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { subscribeToScoreboard, type Team } from '@/lib/firestore';

export default function Scoreboard() {
  // State to store teams data
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    // Set up real-time listener for scoreboard updates
    const unsubscribe = subscribeToScoreboard((updatedTeams) => {
      setTeams(updatedTeams);
      setIsLoading(false);
      setLastUpdated(new Date());
      setError(''); // Clear any previous errors
    });

    // Handle potential errors
    const handleError = (error: Error) => {
      setError('Failed to load scoreboard data. Please refresh the page.');
      setIsLoading(false);
    };

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      unsubscribe();
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
      title="Live Scoreboard" 
      description="Real-time tournament scores - updates automatically"
    >
      {/* Status information */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: '#e8f5e8',
          borderRadius: '20px',
          fontSize: '0.9rem',
          color: '#2d5a2d'
        }}>
          <span style={{ 
            width: '8px', 
            height: '8px', 
            background: '#4caf50', 
            borderRadius: '50%',
            display: 'inline-block'
          }}></span>
          Live Updates Active
        </div>
        {!isLoading && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
            Last updated: {formatLastUpdated(lastUpdated)}
          </p>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="loading">
          <p>Loading scoreboard...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Scoreboard table */}
      {!isLoading && !error && (
        <div className="scoreboard-table">
          {teams.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
              <h3>No teams registered yet</h3>
              <p style={{ marginTop: '0.5rem' }}>
                Be the first to register your team!
              </p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>Rank</th>
                  <th style={{ width: '15%' }}>Team #</th>
                  <th style={{ width: '50%' }}>Players</th>
                  <th style={{ width: '20%' }}>Score</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => (
                  <tr key={team.id || team.teamName}>
                    {/* Rank - based on position in sorted array */}
                    <td>
                      {index === 0 && team.score > 0 ? (
                        <span style={{ fontSize: '1.2rem' }}>🥇</span>
                      ) : index === 1 && team.score > 0 ? (
                        <span style={{ fontSize: '1.2rem' }}>🥈</span>
                      ) : index === 2 && team.score > 0 ? (
                        <span style={{ fontSize: '1.2rem' }}>🥉</span>
                      ) : (
                        `#${index + 1}`
                      )}
                    </td>
                    
                    {/* Team Number */}
                    <td>
                      <strong>#{team.teamNumber}</strong>
                    </td>
                    
                    {/* Team Name and Players */}
                    <td>
                      <div>
                        <div style={{ 
                          fontSize: '1.1rem',
                          fontWeight: 'bold', 
                          color: '#333',
                          marginBottom: '0.25rem'
                        }}>
                          {team.teamName}
                        </div>
                        <div style={{ fontWeight: '500' }}>{team.player1}</div>
                        <div style={{ fontWeight: '500' }}>{team.player2}</div>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: '#666', 
                          marginTop: '0.25rem',
                          fontFamily: 'monospace'
                        }}>
                          UID: {team.uid}
                        </div>
                      </div>
                    </td>
                    
                    {/* Score */}
                    <td>
                      <span style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold',
                        color: team.score > 0 ? '#4caf50' : '#999'
                      }}>
                        {team.score.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Additional information */}
      {!isLoading && teams.length > 0 && (
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#495057', marginBottom: '0.5rem' }}>
            <strong>{teams.length}</strong> team{teams.length !== 1 ? 's' : ''} registered
          </p>
          <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>
            Scores update automatically as games are played
          </p>
        </div>
      )}
    </Layout>
  );
}