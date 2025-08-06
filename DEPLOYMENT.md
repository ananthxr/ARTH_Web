# 🚀 Deployment Guide

This guide walks you through deploying your tournament scoreboard to Vercel and setting up Firebase.

## 📋 Prerequisites

Before deploying, make sure you have:
- [Node.js](https://nodejs.org/) installed on your computer
- A [GitHub](https://github.com/) account
- A [Firebase](https://firebase.google.com/) account
- A [Vercel](https://vercel.com/) account

## 🔥 Step 1: Firebase Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name (e.g., "tournament-scoreboard")
4. Disable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Firestore
1. In your Firebase project, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select a location (choose closest to your users)
5. Click "Done"

### 1.3 Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" > Web app (</> icon)
4. Enter app nickname (e.g., "tournament-web")
5. Click "Register app"
6. **Copy the config values** - you'll need these!

### 1.4 Add Security Rules
1. Go to Firestore Database > Rules
2. Copy the contents of `firestore.rules` from your project
3. Paste into the Firebase Console
4. Click "Publish"

## 🐙 Step 2: GitHub Setup

### 2.1 Create Repository
1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it "tournament-scoreboard"
4. Make it public (for free Vercel hosting)
5. Click "Create repository"

### 2.2 Upload Your Code
If you're using the command line:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tournament-scoreboard.git
git push -u origin main
```

Or use GitHub Desktop or upload files directly through GitHub's web interface.

## ⚡ Step 3: Vercel Deployment

### 3.1 Import Project
1. Go to [Vercel](https://vercel.com)
2. Sign up with your GitHub account
3. Click "New Project"
4. Find your "tournament-scoreboard" repository
5. Click "Import"

### 3.2 Configure Environment Variables
Before deploying, add your Firebase configuration:

1. In the import screen, expand "Environment Variables"
2. Add each of these variables with values from your Firebase config:

```
NEXT_PUBLIC_FIREBASE_API_KEY = your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your-project.firebaseapp.com  
NEXT_PUBLIC_FIREBASE_PROJECT_ID = your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 123456789
NEXT_PUBLIC_FIREBASE_APP_ID = 1:123456789:web:abcdefghijklmnop
```

### 3.3 Deploy
1. Click "Deploy"
2. Wait for deployment to complete (usually 1-2 minutes)
3. 🎉 Your app is live!

## 🔧 Step 4: Testing Your Deployment

### 4.1 Test Registration
1. Visit your Vercel URL
2. Fill out the registration form
3. Check if you get a success message with UID and team number

### 4.2 Test Scoreboard
1. Click "Live Scoreboard"
2. Verify your registered team appears
3. Leave this page open and register another team from a different tab
4. The scoreboard should update automatically!

### 4.3 Test API Endpoints
You can test the API with tools like [Postman](https://postman.com) or curl:

**Register a team:**
```bash
curl -X POST https://your-app.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{"player1":"Test Player 1","player2":"Test Player 2","email":"test@example.com"}'
```

**Update score:**
```bash
curl -X POST https://your-app.vercel.app/api/update-score \
  -H "Content-Type: application/json" \
  -d '{"uid":"YOUR_TEAM_UID","scoreIncrement":100}'
```

## 🎮 Step 5: Unity Integration

Your Unity game can now connect to these endpoints:

- **Registration**: `https://your-app.vercel.app/api/register`
- **Update Score**: `https://your-app.vercel.app/api/update-score`  
- **Get Scoreboard**: `https://your-app.vercel.app/api/scoreboard`

### Unity HTTP Request Example
```csharp
using UnityEngine;
using UnityEngine.Networking;
using System.Collections;

public class ScoreManager : MonoBehaviour 
{
    private string apiUrl = "https://your-app.vercel.app/api";
    
    public IEnumerator UpdateScore(string uid, int points)
    {
        string json = $"{{\"uid\":\"{uid}\",\"scoreIncrement\":{points}}}";
        
        UnityWebRequest request = UnityWebRequest.Post(apiUrl + "/update-score", json, "application/json");
        
        yield return request.SendWebRequest();
        
        if (request.result == UnityWebRequest.Result.Success)
        {
            Debug.Log("Score updated successfully!");
        }
        else
        {
            Debug.LogError("Error updating score: " + request.error);
        }
    }
}
```

## 🔄 Step 6: Making Updates

When you make changes to your code:

1. Push changes to GitHub
2. Vercel automatically redeploys
3. Your live site updates within minutes!

## 🆘 Troubleshooting

### Common Issues:

**"Firebase not defined" error:**
- Check that your environment variables are set correctly in Vercel
- Make sure variable names start with `NEXT_PUBLIC_`

**"Permission denied" in Firebase:**
- Verify your security rules are published correctly
- Check Firebase Console > Firestore > Rules

**Site not updating after deployment:**
- Wait a few minutes for propagation
- Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)
- Check Vercel dashboard for deployment errors

**API endpoints not working:**
- Check Vercel function logs in your dashboard
- Verify your Firebase configuration is correct
- Test with simple curl commands first

### Getting Help:
- Check Vercel dashboard for deployment logs
- Check Firebase Console for database activity
- Check browser developer console for errors

## 🎉 You're Done!

Your tournament scoreboard is now live and ready to use! Share your Vercel URL with participants and start tracking scores in real-time.

**Your URLs:**
- **Registration Page**: `https://your-app.vercel.app/`
- **Live Scoreboard**: `https://your-app.vercel.app/scoreboard`
- **API Base**: `https://your-app.vercel.app/api/`