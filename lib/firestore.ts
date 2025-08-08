// Firebase Realtime Database operations
// This file contains all the functions to interact with our Firebase Realtime Database

import {
  ref,
  set,
  get,
  update,
  push,
  child,
  query,
  orderByChild,
  equalTo,
  onValue,
  off
} from 'firebase/database';
import { db, auth } from './firebase';
import { signInAnonymously } from 'firebase/auth';

// Define the Team interface to ensure type safety
export interface Team {
  uid: string; // Unity identifier (like qK234) - now the main node key
  teamNumber: number;
  teamName: string; // User-friendly team name
  player1: string;
  player2: string;
  email: string;
  phoneNumber: string;
  score: number;
  createdAt: number; // Unix timestamp
}

/**
 * Generate a random alphanumeric UID (like qK234)
 * This will be used as Unity identifier and main node key for each team
 */
export function generateUID(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Ensure user is authenticated before database operations
 */
async function ensureAuth(): Promise<void> {
  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Failed to authenticate anonymously:', error);
      throw new Error('Authentication required');
    }
  }
}

/**
 * Check if a team name is already taken
 */
export async function isTeamNameTaken(teamName: string): Promise<boolean> {
  try {
    await ensureAuth();
    const rootRef = ref(db);
    const snapshot = await get(rootRef);
    
    if (!snapshot.exists()) {
      return false;
    }
    
    const allData = snapshot.val();
    // Check if any UID node has this team name
    for (const uid in allData) {
      if (allData[uid] && allData[uid].teamName === teamName) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking team name:', error);
    return true; // Return true to be safe and prevent duplicates
  }
}

/**
 * Check if email is already registered
 */
export async function isEmailTaken(email: string): Promise<boolean> {
  try {
    await ensureAuth();
    const rootRef = ref(db);
    const snapshot = await get(rootRef);
    
    if (!snapshot.exists()) {
      return false;
    }
    
    const allData = snapshot.val();
    // Check if any UID node has this email
    for (const uid in allData) {
      if (allData[uid] && allData[uid].email === email) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking email:', error);
    return true; // Return true to be safe and prevent duplicates
  }
}

/**
 * Get the next team number by counting existing teams
 * Teams are numbered sequentially starting from 1
 */
export async function getNextTeamNumber(): Promise<number> {
  try {
    await ensureAuth();
    const rootRef = ref(db);
    const snapshot = await get(rootRef);
    
    if (!snapshot.exists()) {
      return 1;
    }
    
    const allData = snapshot.val();
    // Count only valid team nodes (those with teamName property)
    let teamCount = 0;
    for (const uid in allData) {
      if (allData[uid] && allData[uid].teamName) {
        teamCount++;
      }
    }
    return teamCount + 1;
  } catch (error) {
    console.error('Error getting team count:', error);
    return 1; // Default to 1 if there's an error
  }
}

/**
 * Register a new team in the database
 * Returns the team data with assigned team name and number
 * Data structure: /{uid}/ - UID is the main node
 */
export async function registerTeam(
  teamName: string,
  player1: string,
  player2: string,
  email: string,
  phoneNumber: string
): Promise<Team> {
  try {
    await ensureAuth();
    // Check for duplicates
    const [isNameTaken, isEmailAlreadyUsed] = await Promise.all([
      isTeamNameTaken(teamName),
      isEmailTaken(email)
    ]);

    if (isNameTaken) {
      throw new Error(`Team name "${teamName}" is already taken. Please choose a different name.`);
    }

    if (isEmailAlreadyUsed) {
      throw new Error('This email address is already registered. Please use a different email.');
    }

    // Generate unique UID and get next team number
    const uid = generateUID();
    const teamNumber = await getNextTeamNumber();
    
    // Create team object
    const teamData: Team = {
      uid,
      teamNumber,
      teamName,
      player1,
      player2,
      email,
      phoneNumber,
      score: 0,
      createdAt: Date.now()
    };

    // Store in Realtime Database with UID as the main node (no parent 'teams' node)
    const teamRef = ref(db, uid);
    await set(teamRef, teamData);
    
    return teamData;
  } catch (error) {
    console.error('Error registering team:', error);
    if (error instanceof Error) {
      throw error; // Re-throw custom error messages
    }
    throw new Error('Failed to register team. Please try again.');
  }
}

/**
 * Update a team's score using their UID (for Unity integration)
 * Used by the Unity game to update scores - direct access since UID is the main node
 */
export async function updateScore(uid: string, scoreIncrement: number): Promise<boolean> {
  try {
    await ensureAuth();
    const teamRef = ref(db, uid);
    const snapshot = await get(teamRef);
    
    if (!snapshot.exists()) {
      throw new Error('Team not found with the provided UID');
    }

    const currentTeam = snapshot.val();
    const newScore = (currentTeam.score || 0) + scoreIncrement;

    // Update the score
    await update(teamRef, {
      score: newScore
    });

    return true;
  } catch (error) {
    console.error('Error updating score:', error);
    throw error;
  }
}

/**
 * Alternative: Update score using team name (requires searching through all teams)
 * This can be used if you have the team name instead of UID
 */
export async function updateScoreByTeamName(teamName: string, scoreIncrement: number): Promise<boolean> {
  try {
    await ensureAuth();
    const rootRef = ref(db);
    const snapshot = await get(rootRef);
    
    if (!snapshot.exists()) {
      throw new Error('No teams found in database');
    }

    const allData = snapshot.val();
    let targetUID = null;
    
    // Find the team with matching team name
    for (const uid in allData) {
      if (allData[uid] && allData[uid].teamName === teamName) {
        targetUID = uid;
        break;
      }
    }
    
    if (!targetUID) {
      throw new Error('Team not found with the provided team name');
    }

    const currentScore = allData[targetUID].score || 0;
    const newScore = currentScore + scoreIncrement;

    // Update the score
    const teamRef = ref(db, targetUID);
    await update(teamRef, {
      score: newScore
    });

    return true;
  } catch (error) {
    console.error('Error updating score:', error);
    throw error;
  }
}

/**
 * Get all teams for the scoreboard, ordered by score (highest first)
 */
export async function getAllTeams(): Promise<Team[]> {
  try {
    await ensureAuth();
    const rootRef = ref(db);
    const snapshot = await get(rootRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    const allData = snapshot.val();
    const teamsArray: Team[] = [];
    
    // Filter only valid team nodes (those with teamName property)
    for (const uid in allData) {
      if (allData[uid] && allData[uid].teamName) {
        teamsArray.push(allData[uid] as Team);
      }
    }
    
    // Sort by score (highest first), then by team number (ascending)
    teamsArray.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score; // Higher score first
      }
      return a.teamNumber - b.teamNumber; // Lower team number first if scores are equal
    });
    
    return teamsArray;
  } catch (error) {
    console.error('Error getting teams:', error);
    return [];
  }
}

/**
 * Set up real-time listener for scoreboard updates
 * This function will call the callback whenever team data changes
 */
export function subscribeToScoreboard(callback: (teams: Team[]) => void): () => void {
  try {
    const rootRef = ref(db);
    
    console.log('Setting up Realtime Database listener for root...');
    
    const unsubscribe = onValue(rootRef, 
      (snapshot) => {
        console.log('Realtime Database snapshot received');
        
        if (!snapshot.exists()) {
          console.log('No data found');
          callback([]);
          return;
        }

        const allData = snapshot.val();
        const teamsArray: Team[] = [];
        
        // Filter only valid team nodes (those with teamName property)
        for (const uid in allData) {
          if (allData[uid] && allData[uid].teamName) {
            teamsArray.push(allData[uid] as Team);
          }
        }
        
        console.log('Teams data:', teamsArray);
        
        // Sort by score (highest first), then by team number (ascending)
        teamsArray.sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score; // Higher score first
          }
          return a.teamNumber - b.teamNumber; // Lower team number first if scores are equal
        });
        
        callback(teamsArray);
      },
      (error) => {
        console.error('Realtime Database listener error:', error);
        // Still call callback with empty array to update UI state
        callback([]);
      }
    );

    // Return unsubscribe function
    return () => {
      console.log('Unsubscribing from Realtime Database listener');
      off(rootRef, 'value', unsubscribe);
    };
  } catch (error) {
    console.error('Error setting up Realtime Database listener:', error);
    // Return a dummy unsubscribe function
    return () => {};
  }
}