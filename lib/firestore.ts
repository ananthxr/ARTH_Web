// Firestore database operations
// This file contains all the functions to interact with our Firebase database

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  increment,
  query,
  orderBy,
  onSnapshot,
  where,
  Timestamp
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
 */
export async function isTeamNameTaken(teamName: string): Promise<boolean> {
  try {
    const teamsRef = collection(db, 'teams');
    const q = query(teamsRef, where('teamName', '==', teamName));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
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

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'teams'), teamData);
    
    // Return the team data with the document ID
    return {
      id: docRef.id,
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
    // Find the team with the given UID
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
  const teamsRef = collection(db, 'teams');
  const q = query(teamsRef, orderBy('score', 'desc'), orderBy('teamNumber', 'asc'));
  
  // Return the unsubscribe function so we can clean up the listener
  return onSnapshot(q, (snapshot) => {
    const teams = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Team));
    callback(teams);
  });
}