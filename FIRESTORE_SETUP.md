# Firestore Setup Instructions

## Required Firestore Index

The live scoreboard requires a composite index to function properly. You need to create this index in your Firebase console.

### Method 1: Using Firebase CLI (Recommended)

1. Install Firebase CLI if not already installed:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project (if not already done):
   ```bash
   firebase init firestore
   ```

4. Deploy the index configuration:
   ```bash
   firebase deploy --only firestore:indexes
   ```

### Method 2: Manual Creation via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `arth-33ed6`
3. Navigate to Firestore Database → Indexes
4. Click "Create Index"
5. Set up the index with these exact settings:
   - **Collection ID**: `teams`
   - **Fields to index**:
     - Field: `score`, Order: `Descending`
     - Field: `teamNumber`, Order: `Ascending`
   - **Query scopes**: Collection

### Method 3: Using the Error Link

The error message you received contains a direct link to create the index:
```
https://console.firebase.google.com/v1/r/project/arth-33ed6/firestore/indexes?create_composite=Ckhwcm9qZWN0cy9hcnRoLTMzZWQ2L2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy90ZWFtcy9pbmRleGVzL18QARoJCgVzY29yZRACGg4KCnRlYW1OdW1iZXIQARoMCghfX25hbWVfXxAB
```

Simply click this link and it will pre-configure the index for you.

## Database Structure Changes

The database structure has been updated to use UID as document ID instead of team name:

### Previous Structure
```
teams/
├── "Team Alpha"/
│   ├── teamName: "Team Alpha"
│   ├── uid: "qK234"
│   └── ...other fields
└── "Team Beta"/
    ├── teamName: "Team Beta"  
    ├── uid: "aB567"
    └── ...other fields
```

### New Structure (Improved)
```
teams/
├── "qK234"/
│   ├── teamName: "Team Alpha"
│   ├── uid: "qK234"
│   └── ...other fields
└── "aB567"/
    ├── teamName: "Team Beta"
    ├── uid: "aB567" 
    └── ...other fields
```

### Benefits of New Structure
1. **Faster Unity Integration**: Direct document access using UID
2. **Better Performance**: No need to query by UID field
3. **Scalability**: More efficient for large team counts
4. **Consistency**: Document ID matches Unity identifier

## After Index Creation

Once the index is created:
1. The live scoreboard will automatically start working
2. Teams will appear when you refresh the page
3. Real-time updates will function properly
4. No code changes needed - everything is backwards compatible

## Troubleshooting

If teams still don't appear:
1. Verify the index is "Ready" status in Firebase Console
2. Check browser console for any JavaScript errors
3. Ensure Firestore security rules allow read access
4. Try registering a new team to test the new structure