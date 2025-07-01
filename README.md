# DurianRuntuh 🥭

Find Fresh Durians Near You. The ultimate app for durian lovers. Check stock and prices at local stalls in real-time.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (local or cloud)

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
ADMIN_PASSWORD=your-admin-password
DATABASE_URL=postgresql://username:password@localhost:5432/durian_runtuh
```

3. **Set up PostgreSQL database:**
```bash
# Create database
createdb durian_runtuh

# Or using psql
psql -U postgres
CREATE DATABASE durian_runtuh;
\q
```

4. **Start the development servers:**
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

### 2. **Admin Panel - Stall Management**
- Go to http://localhost:3000/admin-login
- Login with admin credentials:
  - **Username:** admin
  - **Password:** (set in ADMIN_PASSWORD environment variable)
- Access the admin panel at http://localhost:3000/admin
- Test adding a new stall:
  - Fill in stall information (name, address, coordinates)
  - Add durian varieties with prices and stock levels
- Test editing existing stalls
- Test deleting stalls

### 3. **Map View (Public Access)**
- Go to "Find Durians" page
- Verify the map loads with OpenStreetMap
- Check that stalls appear on the map
- Click on stall markers to see details
- Test filtering by durian variety
- Verify stock and price information is correct

### 4. **Mobile Testing**
- Test on mobile device or browser dev tools
- Verify responsive design works
- Test touch interactions on map

## 🔐 Access Control

### **Public Pages (No Login Required):**
- Home page (landing page)
- Map page (find durians)

### **Admin Pages (Admin Only):**
- Admin login
- Admin panel (stall CRUD operations)

### **Access Rules:**
- Only admins can create, edit, and delete stalls
- Public users can view stalls on the map
- No user registration or login required for public access

## 🐛 Troubleshooting

### Common Issues:

1. **Database connection failed:**
   - Verify DATABASE_URL is correct
   - Check PostgreSQL is running
   - Ensure database exists: `createdb durian_runtuh`

2. **Port already in use:**
   - Change PORT in `.env` file
   - Kill existing processes: `npx kill-port 3000 5000`

3. **CORS errors:**
   - Verify FRONTEND_URL in `.env` matches your frontend URL
   - Check that both servers are running

4. **Map not loading:**
   - Check browser console for errors
   - Verify internet connection (map tiles from OpenStreetMap)

5. **Admin login issues:**
   - Verify ADMIN_PASSWORD is set in environment variables
   - Default admin username is 'admin'

### API Endpoints:

- `GET /api/health` - Health check
- `GET /api/stalls` - Get all stalls for map

### Admin API Endpoints (Netlify Functions):
- `POST /.netlify/functions/adminLogin` - Admin login
- `GET /.netlify/functions/getAllStalls` - Get all stalls (admin)
- `POST /.netlify/functions/addStall` - Add new stall (admin)
- `PUT /.netlify/functions/editStall` - Edit stall (admin)
- `DELETE /.netlify/functions/deleteStall` - Delete stall (admin)

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
- Real-time stock information
- Mobile-friendly interface

### For Admins:
- Secure admin login
- Create, edit, and delete stalls
- Manage all stall information and coordinates
- Full CRUD operations on stalls

## 🚀 Deployment (Netlify + PostgreSQL)

### **Step 1: Set up PostgreSQL Database**

Choose one of these PostgreSQL providers:

#### **Option A: Supabase (Recommended)**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Format: `postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres`

#### **Option B: Railway**
1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Add PostgreSQL service
4. Copy the connection string from the service

#### **Option C: Neon**
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard

### **Step 2: Deploy to Netlify**

#### **Method A: Deploy from GitHub**
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Set build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click "Deploy site"

#### **Method B: Deploy from local files**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### **Step 3: Configure Environment Variables**

In your Netlify dashboard:
1. Go to Site settings → Environment variables
2. Add these variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secure-jwt-secret
   ADMIN_PASSWORD=your-secure-admin-password
   DATABASE_URL=your-postgresql-connection-string
   ```

### **Step 4: Update Frontend API URLs**

Update `src/pages/Map.jsx` to use Netlify Functions:
```javascript
// Change from local API to Netlify Functions
const response = await axios.get('/.netlify/functions/getStalls')
```

### **Step 5: Test Deployment**

1. Visit your Netlify site URL
2. Test the map functionality
3. Test admin login at `your-site.netlify.app/admin-login`
4. Verify all features work correctly

## 📊 Database Schema (PostgreSQL)

### **stalls** table:
```sql
CREATE TABLE stalls (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **daily_updates** table:
```sql
CREATE TABLE daily_updates (
  id SERIAL PRIMARY KEY,
  stall_id INTEGER NOT NULL,
  varieties JSONB NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (stall_id) REFERENCES stalls (id) ON DELETE CASCADE
);
```

### **Indexes:**
```sql
CREATE INDEX idx_stalls_location ON stalls(latitude, longitude);
CREATE INDEX idx_daily_updates_stall ON daily_updates(stall_id);
CREATE INDEX idx_daily_updates_date ON daily_updates(last_updated);
```

## 🛠️ Development

### **Local Development:**
```bash
# Install dependencies
npm install

# Set up environment
cp env.example .env
# Edit .env with your database URL

# Start development servers
npm run dev:full
```

### **Database Setup:**
Tables are created automatically on first run. For manual setup:
```bash
# Connect to your database
psql $DATABASE_URL

# Run schema (optional - auto-created)
\i server/database/schema.sql
```

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
  varieties TEXT, -- JSON string: array of {name, stock}
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```