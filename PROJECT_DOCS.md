# DurianRuntuh Project Documentation

## Overview
DurianRuntuh is a web application for discovering durian stalls in Malaysia. It features an interactive map for customers and a secure admin panel for managing stall data. The app is built with a React frontend, Node/Express backend, PostgreSQL database, and is deployed on Netlify.

## Features
- Interactive map showing durian stalls by location
- Filter stalls by state and durian variety
- Real-time stock status for each variety
- Mobile-friendly, responsive design
- Secure admin login for CRUD operations on stalls and varieties
- No stall owner accounts; only admin can manage data

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, React-Leaflet
- **Backend:** Node.js, Express (Netlify Functions)
- **Database:** PostgreSQL (e.g., Supabase, Railway, Neon)
- **Deployment:** Netlify (frontend + serverless functions)

## Setup & Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/lalahuha-land/durian-runtuh.git
   cd durian-runtuh
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your PostgreSQL database (see schema below).
4. Copy `env.example` to `.env` and fill in your secrets (store `.env` in `.qodo/` for security).
5. Run locally:
   ```bash
   npm run dev
   # In another terminal (if needed):
   netlify dev
   ```

## Environment Variables
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — a long random string for JWT signing
- `ADMIN_PASSWORD` — your chosen admin password
- `FRONTEND_URL` — (optional) frontend URL for CORS

## Database Schema
- **stalls**: id, name, address, state, latitude, longitude, phone, created_at, updated_at
- **daily_updates**: id, stall_id, varieties (JSONB: [{name, stock}]), last_updated

Example varieties JSON:
```json
[
  {"name": "Musang King", "stock": "high"},
  {"name": "Black Thorn", "stock": "medium"}
]
```

## Deployment
- Deploy frontend and Netlify Functions to Netlify
- Set environment variables in Netlify dashboard
- Use a managed PostgreSQL provider (Supabase, Railway, Neon, etc.)

## Admin Usage
- Visit `/admin-login` to log in as admin
- After login, access `/admin` to manage stalls and varieties
- Only admin can add, edit, or delete stall and variety data

## Security
- `.env` file is stored in `.qodo/` and not tracked by git
- Only admin (with correct password) can access management features
- All sensitive endpoints require a valid JWT

## Contact
For support or questions, open an issue on GitHub or contact the project maintainer. 