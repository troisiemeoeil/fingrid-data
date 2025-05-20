# Fingrid Data Visualization Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## Overview

This is a Next.js-based web application that visualizes energy data from Fingrid's open data API. The application provides an interactive interface to explore various energy metrics such as electricity production, wind power production, and electricity consumption in Finland.

## Features

### Core Features
- **Interactive Map Interface**: Visual representation of energy data points on a grid/map
- **Data Visualization**: Real-time and historical data visualization using Recharts
- **Responsive Design**: Works on both desktop and mobile devices
- **Trend Analysis**: Shows percentage changes in data over time

### Data Points
1. **Electricity Production**
   - Real-time measurements of total electricity production in Finland
   - Data code: 192

2. **Wind Power Production**
   - Real-time measurements of wind power production
   - Data code: 181

3. **Electricity Consumption**
   - Real-time measurements of electricity consumption
   - Data code: 193

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Create a `.env` file in the root directory with the required environment variables:
   ```
   NEXT_PUBLIC_API_URL=your_api_url_here
   NEXT_PUBLIC_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technical Stack

### Frontend
- **Framework**: Next.js 15 with React 19
- **UI Components**: Custom components with Radix UI primitives
- **Styling**: Tailwind CSS with custom theming
- **Data Visualization**: Recharts
- **State Management**: Zustand
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Data Fetching**: Axios

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── fingrid/           # API routes for Fingrid data
│   ├── elements/
│   │   └── DataOverview.jsx   # Data visualization component
│   ├── page.js                # Main page component
│   └── layout.js              # Root layout
├── components/                # Reusable UI components
└── lib/                       # Utility functions and configs
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## API Integration

The application integrates with the Fingrid API to fetch real-time energy data. The API endpoints are proxied through Next.js API routes for security.

### Available Endpoints

- `/api/fingrid?endpoint={endpoint}` - Fetches data for the specified endpoint
  - Query Parameters:
    - `endpoint`: The Fingrid API endpoint (e.g. `192` for electricity production)

## Data Flow

1. User interacts with the map interface
2. Clicking on a data point triggers a dialog
3. The dialog fetches data from the Fingrid API via the Next.js API route
4. Data is processed and displayed in an interactive chart
5. Users can view trends and navigate to detailed views

## Performance Considerations

- Data is cached to minimize API calls
- Images are optimized using Next.js Image component
- Components are code-split for better load times

## License

This project is open source and available under the MIT License.
