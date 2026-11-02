# Food Recipe App (React + Vite)

A React single-page version of the Food Recipe App. Recipe information is loaded from TheMealDB API. User registration, demo login state, and saved recipes use browser Local Storage.

## Requirements
- Node.js 20.19+ or 22.12+
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (normally http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

## Demo administrator account
- Email: `admin@foodrecipe.com`
- Password: `admin123`

Create a normal user through Sign Up to test the User module. The Admin dashboard is available at `/admin` after administrator login.

## Local Storage keys
- `users`: registered demo accounts
- `loggedInUser`: current demo login
- `savedRecipes`: saved recipe objects

## Deploy to Vercel
1. Push this folder to a GitHub repository.
2. In Vercel choose **Add New → Project**, import the repository.
3. Framework preset: **Vite**; Build command: `npm run build`; Output directory: `dist`.
4. Click **Deploy**. The included `vercel.json` supports React Router page refreshes.

## Note
Local Storage authentication is only for an academic demonstration. It is not secure production authentication: data is stored in the user's browser and demo passwords are not protected. Use a backend authentication service for a real application.
