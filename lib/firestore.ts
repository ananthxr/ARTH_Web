// Firestore database operations
// This file contains all the functions to interact with our Firebase database

import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  increment,
  query,
  orderBy,
  onSnapshot,
  where,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';

// Define the Team interface to ensure type safety
export interface Team {
  id?: string;
  teamNumber: number;
  teamName: string; // User-friendly team name
  uid: string; // Unity identifier (like qK234)
  player1: string;
  player2: string;
  email: string;
  phoneNumber: string; // Added phone number
  score: number;
  createdAt: Timestamp;
}

/**
 * Generate a random alphanumeric UID (like qK234)
 * This will be used as Unity identifier for each team
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
 * Check if a team name is already taken
 * Now we just check if the document exists with that ID
 */
export async function isTeamNameTaken(teamName: string): Promise<boolean> {
  try {
    const teamDocRef = doc(db, 'teams', teamName);
    const teamSnapshot = await getDoc(teamDocRef);
    return teamSnapshot.exists();
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
    const teamsRef = collection(db, 'teams');
    const q = query(teamsRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
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
    const teamsRef = collection(db, 'teams');
    const snapshot = await getDocs(teamsRef);
    return snapshot.size + 1; // Return count + 1 for the next team number
  } catch (error) {
    console.error('Error getting team count:', error);
    return 1; // Default to 1 if there's an error
  }
}

/**
 * Register a new team in the database
 * Returns the team data with assigned team name and number
 */
export async function registerTeam(
  teamName: string,
  player1: string,
  player2: string,
  email: string,
  phoneNumber: string
): Promise<Team> {
  try {
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
    const teamData: Omit<Team, 'id'> = {
      teamNumber,
      teamName,
      uid,
      player1,
      player2,
      email,
      phoneNumber,
      score: 0,
      createdAt: Timestamp.now()
    };

    // Use team name as document ID
    const teamDocRef = doc(db, 'teams', teamName);
    await setDoc(teamDocRef, teamData);
    
    // Return the team data with the team name as document ID
    return {
      id: teamName,
      ...teamData
    };
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
 * Used by the Unity game to update scores
 */
export async function updateScore(uid: string, scoreIncrement: number): Promise<boolean> {
  try {
    // We still need to query by UID since Unity uses UID, not team name
    const teamsRef = collection(db, 'teams');
    const q = query(teamsRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Team not found with the provided UID');
    }

    // Update the score (increment by the provided amount)
    const teamDoc = querySnapshot.docs[0];
    await updateDoc(teamDoc.ref, {
      score: increment(scoreIncrement)
    });

    return true;
  } catch (error) {
    console.error('Error updating score:', error);
    throw error;
  }
}

/**
 * Alternative: Update score using team name directly (faster)
 * This can be used if you have the team name instead of UID
 */
export async function updateScoreByTeamName(teamName: string, scoreIncrement: number): Promise<boolean> {
  try {
    // Direct document access using team name as ID
    const teamDocRef = doc(db, 'teams', teamName);
    const teamSnapshot = await getDoc(teamDocRef);
    
    if (!teamSnapshot.exists()) {
      throw new Error('Team not found with the provided team name');
    }

    // Update the score (increment by the provided amount)
    await updateDoc(teamDocRef, {
      score: increment(scoreIncrement)
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
    const teamsRef = collection(db, 'teams');
    const q = query(teamsRef, orderBy('score', 'desc'), orderBy('teamNumber', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Team));
  } catch (error) {
    console.error('Error getting teams:', error);
    return [];
  }
}

/**
 * Set up real-time listener for scoreboard updates
 * This function will call the callback whenever team data changes
 */
export function subscribeToScoreboard(callback: (teams: Team[]) => void) {
  try {
    const teamsRef = collection(db, 'teams');
    const q = query(teamsRef, orderBy('score', 'desc'), orderBy('teamNumber', 'asc'));
    
    console.log('Setting up Firestore listener for teams collection...');
    
    // Return the unsubscribe function so we can clean up the listener
    return onSnapshot(q, 
      (snapshot) => {
        console.log('Firestore snapshot received, docs count:', snapshot.docs.length);
        const teams = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Team data:', { id: doc.id, ...data });
          return {
            id: doc.id,
            ...data
          } as Team;
        });
        callback(teams);
      },
      (error) => {
        console.error('Firestore listener error:', error);
        // Still call callback with empty array to update UI state
        callback([]);
      }
    );
  } catch (error) {
    console.error('Error setting up Firestore listener:', error);
    // Return a dummy unsubscribe function
    return () => {};
  }
}