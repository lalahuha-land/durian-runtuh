# DurianRuntuh 🥭

Find Fresh Durians Near You. The ultimate app for durian lovers. Check stock and prices at local stalls in real-time.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Create environment file:**
Create a `.env` file in the root directory:
```env
NODE_ENV=development
JWT_SECRET=durian-runtuh-secret-key-2024
FRONTEND_URL=http://localhost:3000
PORT=5000
```

3. **Start the development servers:**
```bash
# Start both frontend and backend
npm run dev:full

# Or start them separately:
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

## 🧪 Testing the Full Flow

### 1. **Homepage & Navigation (Public Access)**
- Open http://localhost:3000
- Verify the homepage loads with durian theme
- Test navigation between pages
- Check mobile responsiveness
- Note: Home page is only accessible to non-logged-in users

### 2. **Stall Owner Registration**
- Click "Register Stall" button in navbar
- Fill out the registration form:
  - **Name:** Test Owner
  - **Email:** test@durianruntuh.com
  - **Password:** test123456
  - **Phone:** +60 12-345 6789
  - **Stall Name:** Test Durian Stall
  - **Address:** 123 Test Street, KL
- Submit and verify you're redirected to dashboard

### 3. **Stall Owner Dashboard (Protected Access)**
- Verify stall information is displayed
- Click "Edit Stall Info" to update stall details
- Add coordinates (optional) to help customers find your stall
- Test the stock update form:
  - Enable "Musang King" and set price to RM45
  - Enable "Black Thorn" and set price to RM35
  - Set stock levels to "High"
  - Submit the form
- Verify success message appears
- Check "Last updated" timestamp updates

### 4. **Login/Logout Flow**
- Logout from dashboard (redirects to home page)
- Click "Login" in navbar
- Login with your registered email and password
- Verify you're redirected to dashboard
- Try accessing home page when logged in (should redirect to dashboard)
- Try accessing dashboard without being logged in (should redirect to login)

### 5. **Map View (Public Access)**
- Go to "Find Durians" page
- Verify the map loads with OpenStreetMap
- Check that your stall appears on the map
- Click on the stall marker to see details
- Test filtering by durian variety
- Verify stock and price information is correct

### 6. **Mobile Testing**
- Test on mobile device or browser dev tools
- Verify responsive design works
- Test touch interactions on map

## 🔐 Access Control

### **Public Pages (No Login Required):**
- Home page (landing page)
- Map page (find durians)
- Login page
- Register page

### **Protected Pages (Login Required):**
- Dashboard (stall management)

### **Access Rules:**
- Logged-in users are automatically redirected to dashboard
- Non-logged-in users trying to access dashboard are redirected to login
- Home page is hidden from logged-in users in navigation

## 🐛 Troubleshooting

### Common Issues:

1. **Database not found:**
   - The SQLite database will be created automatically on first run
   - Check that `durian-runtuh.db` file exists in root directory

2. **Port already in use:**
   - Change PORT in `.env` file
   - Kill existing processes: `npx kill-port 3000 5000`

3. **CORS errors:**
   - Verify FRONTEND_URL in `.env` matches your frontend URL
   - Check that both servers are running

4. **Map not loading:**
   - Check browser console for errors
   - Verify internet connection (map tiles from OpenStreetMap)

### API Endpoints:

- `GET /api/health` - Health check
- `POST /api/auth/register` - Register new stall owner
- `POST /api/auth/login` - Login stall owner
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/stalls` - Get all stalls for map
- `GET /api/stalls/my-stall` - Get user's stall (protected)
- `PUT /api/stalls/update-stall` - Update stall information (protected)
- `POST /api/stalls/update-stock` - Update daily stock (protected)

## 🎨 Design Theme

The app uses a custom durian-themed color palette:
- **Primary:** #007852 (Dark Green)
- **Secondary:** #01AF5E (Medium Green)
- **Light:** #95D598 (Light Green)
- **Cream:** #F5F6E4 (Background)
- **Yellow:** #FFE32B (Accent)

## 📱 Features

### For Customers:
- Interactive map showing durian stalls
- Filter by durian variety
- Real-time stock and price information
- Mobile-friendly interface

### For Stall Owners:
- Simple registration process
- Login to access dashboard
- Update stall information and coordinates
- Easy daily stock updates
- Mobile-optimized dashboard
- Real-time visibility on map
- Protected access to management features

## 🚀 Deployment

### Frontend (Vercel/Netlify):
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Fly.io):
```bash
# Set production environment variables
NODE_ENV=production
JWT_SECRET=your-secure-secret
FRONTEND_URL=https://your-domain.com
```

## 📊 Database Schema

- **users:** User accounts and authentication
- **stalls:** Stall information and location
- **daily_updates:** Daily stock updates with varieties and prices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning and commercial purposes!

---

**Happy Durian Hunting! 🥭✨**

## Features
- **Customer Map & Search:** Customers can search for durian stalls by state and variety, view details, and open navigation in Waze or Google Maps.
- **Admin Panel:** Only admin can add, edit, or delete stall details and durian varieties.
- **No Stall Owners:** Only admin manages stalls; customers cannot register or manage stalls.
- **PostgreSQL Database:** All stall and variety data is stored in PostgreSQL (e.g., Neon, Supabase, Railway).
- **Netlify Functions:** All backend logic (CRUD, auth) is handled by serverless functions.

## Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/lalahuha-land/durian-runtuh.git
cd durian-runtuh
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
- Use PostgreSQL (Neon, Supabase, Railway, etc.)
- Run the following SQL to set up your schema:

```sql
CREATE TABLE IF NOT EXISTS stalls (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  state TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  phone TEXT,
  varieties TEXT, -- JSON string: array of {name, price, stock}
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Environment Variables
Set these in your `.env` (for local) and in Netlify dashboard:
- `DATABASE_URL` — your PostgreSQL connection string
- `JWT_SECRET` — a long random string
- `ADMIN_PASSWORD` — your chosen admin password

### 5. Netlify Functions
- All backend logic is in `/netlify/functions/` (addStall, editStall, deleteStall, getAllStalls, adminLogin, etc.)
- Functions require a valid admin JWT for stall management endpoints.

### 6. Running Locally
```bash
npm run dev
# In another terminal (if needed):
netlify dev
```

### 7. Deployment
- Deploy to Netlify for frontend and serverless backend.
- Set environment variables in Netlify dashboard.

## Admin Usage
- Go to `/admin-login` to log in as admin.
- After login, access `/admin` to manage stalls and varieties.
- Only admin can add, edit, or delete stalls and varieties.

## Customer Usage
- Customers can search for stalls by state and durian variety on the map.
- Click a stall to view details and open navigation in Waze or Google Maps.

## Tech Stack
- React + Vite (frontend)
- Tailwind CSS (styling)
- Netlify Functions (backend)
- PostgreSQL (database)

## License
GPL-3.0 