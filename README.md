# Tournament Scoreboard System

A simple, beginner-friendly full-stack web application for tournament registration and live scoreboard display. Built with Next.js and Firebase.

## 🚀 Features

- **Team Registration**: Web form to register teams with player names and email
- **Live Scoreboard**: Real-time score updates using Firebase listeners  
- **Unity Integration**: REST API endpoints for game integration
- **Auto Team Numbering**: Teams are automatically assigned sequential numbers
- **Unique IDs**: Each team gets a unique 5-character alphanumeric ID
- **Secure**: Firebase security rules prevent unauthorized data modification

## 🛠️ Tech Stack

- **Frontend**: Next.js (React)
- **Backend**: Firebase Firestore
- **Hosting**: Vercel
- **Real-time Updates**: Firebase real-time listeners
- **API**: Next.js API routes

## 📁 Project Structure

```
tournament-scoreboard/
├── components/
│   └── Layout.tsx          # Shared layout component
├── lib/
│   ├── firebase.ts         # Firebase configuration
│   └── firestore.ts        # Database operations
├── pages/
│   ├── api/
│   │   ├── register.ts     # POST /api/register
│   │   ├── update-score.ts # POST /api/update-score  
│   │   └── scoreboard.ts   # GET /api/scoreboard
│   ├── _app.tsx           # Next.js app wrapper
│   ├── index.tsx          # Registration page
│   └── scoreboard.tsx     # Live scoreboard page
├── styles/
│   └── globals.css        # Global styles
├── firestore.rules        # Firebase security rules
└── .env.local.example     # Environment variables template
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Firestore Database
4. Get your config values from Project Settings > General > Your apps
5. Copy `.env.local.example` to `.env.local` and fill in your values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdefghijklmnop
```

### 3. Configure Firestore Security Rules

1. Go to Firebase Console > Firestore Database > Rules
2. Copy the contents of `firestore.rules` and paste them
3. Click "Publish"

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## 🚀 Deployment to Vercel

### Automatic Deployment (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add your environment variables in Vercel settings
5. Deploy!

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🎮 Unity Integration

Your Unity game can use these API endpoints:

### Register Team
```http
POST /api/register
Content-Type: application/json

{
  "player1": "Alice",
  "player2": "Bob", 
  "email": "team@example.com"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "teamNumber": 1,
    "uid": "qK234",
    "player1": "Alice",
    "player2": "Bob",
    "email": "team@example.com",
    "score": 0
  }
}
```

### Update Score
```http
POST /api/update-score
Content-Type: application/json

{
  "uid": "qK234",
  "scoreIncrement": 100
}
```

### Get Scoreboard
```http
GET /api/scoreboard
```

## 📊 Database Structure

Teams are stored in Firestore with this structure:

```json
{
  "teamNumber": 1,
  "uid": "qK234",
  "player1": "Alice",
  "player2": "Bob",
  "email": "team@example.com", 
  "score": 0,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

## 🔒 Security

- Firebase security rules prevent unauthorized writes
- Only score updates are allowed after team registration
- Score increments are limited to prevent abuse
- Email validation on registration
- All API endpoints include proper error handling

## 🤝 Contributing

This is a beginner-friendly project! Feel free to:
- Add new features
- Improve the UI/UX
- Fix bugs
- Add tests
- Improve documentation

## 📝 License

MIT License - feel free to use this project for your tournaments!