// API Endpoint: POST /api/register
// This endpoint allows Unity (or other clients) to register teams programmatically

import type { NextApiRequest, NextApiResponse } from 'next';
import { registerTeam } from '@/lib/firestore';

// Define the response types for better type safety
type SuccessResponse = {
  success: true;
  data: {
    teamNumber: number;
    teamName: string;
    uid: string;
    player1: string;
    player2: string;
    email: string;
    phoneNumber: string;
    score: number;
  };
};

type ErrorResponse = {
  success: false;
  error: string;
};

type ApiResponse = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    // Extract data from request body
    const { teamName, player1, player2, email, phoneNumber } = req.body;

    // Validate required fields
    if (!teamName || !player1 || !player2 || !email || !phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields. Please provide teamName, player1, player2, email, and phoneNumber.'
      });
    }

    // Validate field types
    if (typeof teamName !== 'string' || typeof player1 !== 'string' || typeof player2 !== 'string' || typeof email !== 'string' || typeof phoneNumber !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid field types. All fields must be strings.'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format.'
      });
    }

    // Basic phone validation
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,15}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format.'
      });
    }

    // Register the team
    const team = await registerTeam(
      teamName.trim(),
      player1.trim(),
      player2.trim(), 
      email.trim(),
      phoneNumber.trim()
    );

    // Return success response
    res.status(201).json({
      success: true,
      data: {
        teamNumber: team.teamNumber,
        teamName: team.teamName,
        uid: team.uid,
        player1: team.player1,
        player2: team.player2,
        email: team.email,
        phoneNumber: team.phoneNumber,
        score: team.score
      }
    });

  } catch (error) {
    console.error('Registration API error:', error);
    
    // Return error response
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}