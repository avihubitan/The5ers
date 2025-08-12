import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import Layout from './components/Layout'
import PortfolioPage from './pages/PortfolioPage'
import StockDetailPage from './pages/StockDetailPage'

function App() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Layout>
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/stock/:symbol" element={<StockDetailPage />} />
        </Routes>
      </Layout>
    </Box>
  )
}

export default App
