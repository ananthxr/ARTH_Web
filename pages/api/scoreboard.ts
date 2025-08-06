// API Endpoint: GET /api/scoreboard
// This endpoint returns all teams and their scores for Unity or other clients

import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllTeams, type Team } from '@/lib/firestore';

// Define the response types for better type safety
type SuccessResponse = {
  success: true;
  data: {
    teams: Team[];
    totalTeams: number;
    lastUpdated: string;
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
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET.'
    });
  }

  try {
    // Get all teams from Firestore
    const teams = await getAllTeams();

    // Return success response with team data
    res.status(200).json({
      success: true,
      data: {
        teams: teams,
        totalTeams: teams.length,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Scoreboard API error:', error);
    
    // Return error response
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch scoreboard data'
    });
  }
}