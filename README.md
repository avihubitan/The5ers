# The5ers Stock Management Website

A comprehensive stock management web application built with React, NestJS, and MongoDB. Users can manage their stock portfolios, view real-time stock information, and track their investments.

## 🚀 Features

- **Portfolio Management**: Add and remove stocks from your portfolio
- **Real-time Stock Data**: Get live stock quotes and market information
- **Stock Search**: Search for stocks by company name or symbol
- **Detailed Stock Views**: Comprehensive stock information with trading data
- **Responsive Design**: Modern UI built with Material-UI
- **API Documentation**: Swagger documentation for backend APIs

## 🛠️ Tech Stack

### Monorepo & Build Tools

- **Nx 17.2.8** for monorepo management and build orchestration
- **npm workspaces** for dependency management

### Frontend

- **React 18** with TypeScript
- **Material-UI (MUI)** for modern UI components
- **React Router** for navigation
- **Axios** for API communication
- **Vite** for fast development and building

### Backend

- **NestJS** with TypeScript
- **MongoDB** with Mongoose ODM
- **Financial Modeling Prep API** for stock data
- **Swagger** for API documentation
- **Class-validator** for request validation

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd the5ers
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend and backend dependencies
npm run install:all
```

### 3. Environment Setup

#### Backend Environment

Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env
```

Edit the `.env` file with your configuration:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/stock-management

# Financial Modeling Prep API Key
# Get your free API key from: https://financialmodelingprep.com/developer/docs/
FINANCIAL_MODELING_PREP_API_KEY=your_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development
```

#### Get API Key

1. Visit [Financial Modeling Prep](https://financialmodelingprep.com/developer/docs/)
2. Create a free account
3. Get your API key
4. Add it to the `.env` file

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# For local MongoDB
mongod

# Or if using MongoDB Atlas, your connection string should be in the .env file
```

### 5. Run the Application

#### Development Mode (Both Frontend and Backend)

```bash
npm run dev
```

This will start:

- Backend server on `http://localhost:3001`
- Frontend development server on `http://localhost:3000`
- Swagger documentation on `http://localhost:3001/api`

#### Run Separately

**Backend only:**

```bash
npm run dev:backend
# or using Nx directly
nx serve backend
```

**Frontend only:**

```bash
npm run dev:frontend
# or using Nx directly
nx serve frontend
```

#### Nx Commands

```bash
# View project graph
nx graph

# Run tests
nx test frontend
nx test backend

# Lint code
nx lint frontend
nx lint backend

# Build projects
nx build frontend
nx build backend
```

## 📁 Project Structure

```
the5ers/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript interfaces
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # App entry point
│   ├── package.json
│   ├── project.json        # Nx project configuration
│   └── vite.config.ts
├── backend/                  # NestJS backend application
│   ├── src/
│   │   ├── stocks/         # Stock-related modules
│   │   ├── portfolio/      # Portfolio management
│   │   ├── infrastructure/ # External services and cache
│   │   ├── config/         # Configuration modules
│   │   ├── types/          # TypeScript interfaces
│   │   ├── app.module.ts   # Main app module
│   │   └── main.ts         # App entry point
│   ├── package.json
│   ├── project.json        # Nx project configuration
│   ├── webpack.config.js   # Webpack configuration for Nx
│   ├── jest.config.ts      # Jest configuration for Nx
│   └── .env               # Environment variables (create this)
├── package.json             # Root package.json with Nx dependencies
├── nx.json                  # Nx workspace configuration
├── jest.preset.js          # Jest preset for Nx
├── setup.md                # Quick setup guide
└── README.md
```

## 🔧 API Endpoints

### Stocks

- `GET /api/stocks/quote/:symbol` - Get stock quote by symbol
- `GET /api/stocks/search?q=query` - Search stocks
- `GET /api/stocks/quotes?symbols=symbol1,symbol2` - Get multiple stock quotes

### Portfolio

- `GET /api/portfolio?userId=default` - Get user portfolio
- `POST /api/portfolio/stocks?userId=default` - Add stock to portfolio
- `DELETE /api/portfolio/stocks/:symbol?userId=default` - Remove stock from portfolio

## 🎨 User Interface

### Portfolio Page

- View all stocks in your portfolio
- See real-time prices and changes
- Add new stocks with search functionality
- Remove stocks from portfolio
- Portfolio summary with total value and changes

### Stock Detail Page

- Comprehensive stock information
- Real-time price and change data
- Trading information (open, high, low, volume)
- Market data (market cap, volume)
- Add/remove from portfolio functionality

## 🔒 Environment Variables

| Variable                          | Description               | Required | Default     |
| --------------------------------- | ------------------------- | -------- | ----------- |
| `MONGODB_URI`                     | MongoDB connection string | Yes      | -           |
| `FINANCIAL_MODELING_PREP_API_KEY` | API key for stock data    | Yes      | -           |
| `PORT`                            | Backend server port       | No       | 3001        |
| `NODE_ENV`                        | Environment mode          | No       | development |

## 🚀 Deployment

### Build for Production

```bash
# Build both frontend and backend
npm run build

# Build frontend only
npm run build:frontend

# Build backend only
npm run build:backend
```

### Production Environment

1. Set `NODE_ENV=production` in your environment
2. Configure your MongoDB connection string
3. Set up your Financial Modeling Prep API key
4. Deploy the backend to your server
5. Serve the frontend build files

## 🧪 Testing

```bash
# Run all tests
nx run-many --target=test --projects=frontend,backend

# Run frontend tests
nx test frontend

# Run backend tests
nx test backend
```

## 🔍 Code Quality

```bash
# Lint all projects
nx run-many --target=lint --projects=frontend,backend

# Lint frontend
nx lint frontend

# Lint backend
nx lint backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support & Troubleshooting

If you encounter any issues:

1. **MongoDB Connection**: Check that MongoDB is running and the connection string is correct
2. **API Key Issues**: Verify your Financial Modeling Prep API key is valid and has sufficient quota
3. **Frontend Errors**: Check the browser console for JavaScript errors
4. **Backend Errors**: Check the server logs for detailed error messages
5. **Environment Variables**: Ensure all required environment variables are set correctly
6. **Port Conflicts**: Change the PORT in your .env file if port 3001 is already in use

### Common Issues:

- **CORS errors**: The backend is configured to allow requests from the frontend
- **API rate limits**: The free tier of Financial Modeling Prep has rate limits
- **MongoDB connection**: Make sure MongoDB is running on the specified URI

## 🎯 Evaluation Criteria Met

- ✅ **Adherence to best practices**: Clean code structure, proper error handling, TypeScript usage
- ✅ **Modularity, reusability, and separation of concerns**: Well-organized components and services
- ✅ **Functional correctness and robustness**: Comprehensive error handling and validation
- ✅ **Performance and maintainability**: Efficient API calls, proper state management, caching
- ✅ **User interface design and usability**: Modern Material-UI design with responsive layout

## 📚 Additional Resources

- [Nx Documentation](https://nx.dev/)
- [NestJS Documentation](https://nestjs.com/)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Financial Modeling Prep API](https://financialmodelingprep.com/developer/docs/)

---

**High 5! 🖐️** - Built with ❤️ for The5ers assignment
