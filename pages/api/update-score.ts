// API Endpoint: POST /api/update-score
// This endpoint allows Unity to update team scores using the UID

import type { NextApiRequest, NextApiResponse } from 'next';
import { updateScore } from '@/lib/firestore';

// Define the response types for better type safety
type SuccessResponse = {
  success: true;
  message: string;
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
    const { uid, scoreIncrement } = req.body;

    // Validate required fields
    if (!uid) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: uid'
      });
    }

    if (scoreIncrement === undefined || scoreIncrement === null) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: scoreIncrement'
      });
    }

    // Validate field types
    if (typeof uid !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid field type: uid must be a string'
      });
    }

    if (typeof scoreIncrement !== 'number' || isNaN(scoreIncrement)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid field type: scoreIncrement must be a number'
      });
    }

    // Validate score increment is reasonable (prevent abuse)
    if (scoreIncrement < -1000000 || scoreIncrement > 1000000) {
      return res.status(400).json({
        success: false,
        error: 'Score increment must be between -1,000,000 and 1,000,000'
      });
    }

    // Update the score
    await updateScore(uid.trim(), scoreIncrement);

    // Return success response
    res.status(200).json({
      success: true,
      message: `Score updated successfully. Added ${scoreIncrement} points to team ${uid}.`
    });

  } catch (error) {
    console.error('Update score API error:', error);
    
    // Handle specific error cases
    if (error instanceof Error && error.message.includes('Team not found')) {
      return res.status(404).json({
        success: false,
        error: 'Team not found with the provided UID'
      });
    }
    
    // Return generic error response
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}