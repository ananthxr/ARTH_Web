// API Endpoint: GET/POST /api/team
// This endpoint allows Unity to retrieve team data by UID or team name

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import type { Team } from '@/lib/firestore';

type SuccessResponse = {
  success: true;
  data: Team;
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
  if (req.method === 'GET') {
    // Get team by UID or team name from query parameters
    const { uid, teamName } = req.query;

    if (!uid && !teamName) {
      return res.status(400).json({
        success: false,
        error: 'Please provide either uid or teamName parameter'
      });
    }

    try {
      let team: Team | null = null;

      if (uid && typeof uid === 'string') {
        // Direct access by UID (UID is the main node key)
        const teamRef = ref(db, uid);
        const teamSnapshot = await get(teamRef);
        
        if (teamSnapshot.exists()) {
          team = teamSnapshot.val() as Team;
        }
      } else if (teamName && typeof teamName === 'string') {
        // Search by team name - need to check all root nodes
        const rootRef = ref(db);
        const rootSnapshot = await get(rootRef);
        
        if (rootSnapshot.exists()) {
          const allData = rootSnapshot.val();
          // Find team with matching team name
          for (const uid in allData) {
            if (allData[uid] && allData[uid].teamName === teamName) {
              team = allData[uid] as Team;
              break;
            }
          }
        }
      }

      if (!team) {
        return res.status(404).json({
          success: false,
          error: 'Team not found'
        });
      }

      res.status(200).json({
        success: true,
        data: team
      });

    } catch (error) {
      console.error('Get team API error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }

  } else if (req.method === 'POST') {
    // Alternative way to get team data via POST body
    const { uid, teamName } = req.body;

    if (!uid && !teamName) {
      return res.status(400).json({
        success: false,
        error: 'Please provide either uid or teamName in request body'
      });
    }

    try {
      let team: Team | null = null;

      if (uid) {
        // Direct access by UID (UID is the main node key)
        const teamRef = ref(db, uid);
        const teamSnapshot = await get(teamRef);
        
        if (teamSnapshot.exists()) {
          team = teamSnapshot.val() as Team;
        }
      } else if (teamName) {
        // Search by team name - need to check all root nodes
        const rootRef = ref(db);
        const rootSnapshot = await get(rootRef);
        
        if (rootSnapshot.exists()) {
          const allData = rootSnapshot.val();
          // Find team with matching team name
          for (const uid in allData) {
            if (allData[uid] && allData[uid].teamName === teamName) {
              team = allData[uid] as Team;
              break;
            }
          }
        }
      }

      if (!team) {
        return res.status(404).json({
          success: false,
          error: 'Team not found'
        });
      }

      res.status(200).json({
        success: true,
        data: team
      });

    } catch (error) {
      console.error('Get team API error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }

  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET or POST.'
    });
  }
}