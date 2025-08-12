# Quick Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Financial Modeling Prep API key

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
npm run install:all
```

### 2. Configure Environment

```bash
cd backend
cp env.example .env
```

Edit `backend/.env` with your settings:

```env
MONGODB_URI=mongodb://localhost:27017/stock-management
FINANCIAL_MODELING_PREP_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=development
```

### 3. Get API Key

1. Visit: https://financialmodelingprep.com/developer/docs/
2. Create free account
3. Copy your API key
4. Add to `.env` file

### 4. Start MongoDB

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (update connection string in .env)
```

### 5. Run Application

```bash
# Both frontend and backend (using Nx)
npm run dev

# Or separately:
npm run dev:backend  # Backend only
npm run dev:frontend # Frontend only

# Or using Nx directly:
nx serve backend     # Backend only
nx serve frontend    # Frontend only
```

### 6. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api

## Troubleshooting

### Common Issues:

1. **MongoDB not running**: Start MongoDB service
2. **API rate limit**: Wait for reset or upgrade plan
3. **Port conflicts**: Change PORT in .env file
4. **CORS issues**: Check frontend proxy configuration

### Verify Setup:

1. Backend starts without errors
2. Frontend loads on localhost:3000
3. Can search for stocks (e.g., "AAPL")
4. Can add stocks to portfolio
5. Stock details page works

## Next Steps

- Add stocks to your portfolio
- Explore the API documentation
- Customize the UI as needed
- Deploy to production

Happy coding! 🚀
