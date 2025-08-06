// Home page - Team Registration Form
// This is the main registration page where teams sign up

import { useState } from 'react';
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
    <Layout 
      title="AR Treasure Hunt Registration" 
      description="Join the AR treasure hunt adventure by Curiospark"
    >
      <div className="form-container">
        {/* Show success message if team was registered */}
        {registeredTeam && (
          <div className="success-message">
            <h3>🎉 Team Registered Successfully!</h3>
            <p><strong>Team Name:</strong> {registeredTeam.teamName}</p>
            <p><strong>Team Number:</strong> {registeredTeam.teamNumber}</p>
            <p><strong>Unity ID:</strong> <code style={{backgroundColor: '#f1f1f1', padding: '2px 6px', borderRadius: '4px'}}>{registeredTeam.uid}</code></p>
            <p><strong>Players:</strong> {registeredTeam.player1} & {registeredTeam.player2}</p>
            <p><strong>Contact:</strong> {registeredTeam.email} | {registeredTeam.phoneNumber}</p>
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
              <p style={{ margin: '0', fontSize: '0.9rem', fontWeight: 'bold' }}>
                📱 <strong>For Unity Game:</strong> Use this UID: <code style={{backgroundColor: '#f39c12', color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold'}}>{registeredTeam.uid}</code>
              </p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem' }}>
                Enter this UID when starting the AR treasure hunt game!
              </p>
            </div>
            <button 
              onClick={handleRegisterAnother}
              className="btn"
              style={{ marginTop: '1rem' }}
            >
              Register Another Team
            </button>
          </div>
        )}

        {/* Show error message if there was an error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Registration form - only show if no team is registered */}
        {!registeredTeam && (
          <form onSubmit={handleSubmit}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{ 
                fontSize: '2.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 'bold',
                margin: '0 0 0.5rem 0'
              }}>
                🏴‍☠️ AR Treasure Hunt
              </h1>
              <p style={{ 
                fontSize: '1.2rem', 
                color: '#666', 
                margin: '0 0 1rem 0' 
              }}>
                Presented by <strong style={{ color: '#667eea' }}>Curiospark</strong>
              </p>
              <h2 style={{ 
                fontSize: '1.5rem',
                color: '#333',
                margin: '0'
              }}>
                ⚔️ Register Your Crew
              </h2>
            </div>

            {/* Team Name */}
            <div className="form-group">
              <label htmlFor="teamName">Team Name *</label>
              <input
                type="text"
                id="teamName"
                name="teamName"
                value={formData.teamName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your team name (2-30 characters)"
                required
                disabled={isSubmitting}
                maxLength={30}
              />
            </div>

            {/* Player 1 Name */}
            <div className="form-group">
              <label htmlFor="player1">Player 1 Name *</label>
              <input
                type="text"
                id="player1"
                name="player1"
                value={formData.player1}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter first player's name"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Player 2 Name */}
            <div className="form-group">
              <label htmlFor="player2">Player 2 Name *</label>
              <input
                type="text"
                id="player2"
                name="player2"
                value={formData.player2}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter second player's name"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Team Email */}
            <div className="form-group">
              <label htmlFor="email">Team Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter team email address"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter phone number (e.g., +1234567890)"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering Crew...' : '⚔️ Register Crew'}
            </button>
          </form>
        )}

        {/* Instructions */}
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '0.5rem', color: '#495057' }}>How it works:</h4>
          <ol style={{ paddingLeft: '1.5rem', color: '#6c757d' }}>
            <li>🏴‍☠️ Choose a unique crew name and add your adventurers</li>
            <li>📱 Provide contact information for quest updates</li>
            <li>⚡ Click "Register Crew" to get your unique treasure hunter ID</li>
            <li>🎮 Enter your UID in the AR app to begin the hunt</li>
            <li>🏆 Watch the live leaderboard as you collect treasures!</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
}