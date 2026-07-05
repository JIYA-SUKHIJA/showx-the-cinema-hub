// src/App.jsx
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { BookingProvider } from './context/BookingContext';
import { ThemeProvider } from './context/ThemeContext'; // FIXED Context path alignment rule
import './components/styles/DashboardLayout.css';

// Layout Templates remain static as they are needed immediately
import MainLayout from './components/templates/MainLayout';
import AuthLayout from './components/templates/AuthLayout';
import NotFound from './pages/NotFound';

// Protected Route Module Placeholder
import ProtectedRoute from './components/organisms/ProtectedRoute';

// Dynamic Lazy Imports for Public Pages & Ticketing Channels
const Home = lazy(() => import('./pages/Home'));
const MovieListing = lazy(() => import('./pages/MovieListing'));
const StreamListing = lazy(() => import('./pages/StreamListing'));
const EventsListing = lazy(() => import('./pages/EventsListing'));
const PlaysListing = lazy(() => import('./pages/PlaysListing'));
const MovieDetails = lazy(() => import('./pages/MovieDetails'));
const SelectShow = lazy(() => import('./pages/SelectShow'));
const SelectSeats = lazy(() => import('./pages/SelectSeats'));
const Payment = lazy(() => import('./pages/Payment'));
const Confirmation = lazy(() => import('./pages/Confirmation'));

// New Settings and Support Pages Loaded Safely
const Settings = lazy(() => import('./pages/Settings'));
const Support = lazy(() => import('./pages/Support'));

// Dynamic Lazy Imports for Authentication Module Pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Profile = lazy(() => import('./pages/Profile'));

// Dynamic Lazy Import for the Admin Dashboard page
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Enhanced adaptive fallback loader matching active UI theme modes
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-transparent text-slate-400 font-sans">
    <div className="relative flex items-center justify-center">
      <span className="w-10 h-10 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin" />
      <span className="absolute w-6 h-6 border-4 border-transparent border-b-yellow-500 rounded-full animate-spin [animation-direction:reverse]" />
    </div>
    <div className="text-center space-y-1">
      <p className="text-xs text-amber-500 font-black tracking-widest uppercase font-mono animate-pulse">Syncing Layout Nodes</p>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: (
      <NotFound 
        title="Application Sync Error" 
        message="We encountered an issue downloading the visual component elements for this screen. Please try refreshing the tab." 
      />
    ),
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><Home /></Suspense> },
      { path: 'movies', element: <Suspense fallback={<PageLoader />}><MovieListing /></Suspense> },
      { path: 'stream', element: <Suspense fallback={<PageLoader />}><StreamListing /></Suspense> },
      { path: 'events', element: <Suspense fallback={<PageLoader />}><EventsListing /></Suspense> },
      { path: 'plays', element: <Suspense fallback={<PageLoader />}><PlaysListing /></Suspense> },
      
      // Plural, Singular, and Category routes pointing to custom briefings
      { path: 'movies/:movieId', element: <Suspense fallback={<PageLoader />}><MovieDetails /></Suspense> },
      { path: 'movie/:movieId', element: <Suspense fallback={<PageLoader />}><MovieDetails /></Suspense> },
      { path: 'stream/:streamId', element: <Suspense fallback={<PageLoader />}><MovieDetails /></Suspense> },
      { path: 'events/:eventId', element: <Suspense fallback={<PageLoader />}><MovieDetails /></Suspense> },
      { path: 'plays/:playId', element: <Suspense fallback={<PageLoader />}><MovieDetails /></Suspense> },
      
      // Guarded Dashboard Profile Route
      { 
        path: 'profile', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      
      // User Menu Panel Pages
      { path: 'settings', element: <Suspense fallback={<PageLoader />}><Settings /></Suspense> },
      { path: 'support', element: <Suspense fallback={<PageLoader />}><Support /></Suspense> },
      
      { path: 'booking/:movieId/shows', element: <Suspense fallback={<PageLoader />}><SelectShow /></Suspense> },
      { path: 'booking/:movieId/seats', element: <Suspense fallback={<PageLoader />}><SelectSeats /></Suspense> },
      
      { path: 'checkout', element: <Suspense fallback={<PageLoader />}><Payment /></Suspense> },
      { path: 'confirmation/:bookingId', element: <Suspense fallback={<PageLoader />}><Confirmation /></Suspense> },
      { path: '*', element: <Suspense fallback={<PageLoader />}><NotFound /></Suspense> },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Suspense fallback={<PageLoader />}><Login /></Suspense> },
      { path: 'register', element: <Suspense fallback={<PageLoader />}><Register /></Suspense> },
      { path: 'forgot-password', element: <Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense> },
    ]
  },
  {
    path: 'admin',
    element: <Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>,
  }
]);

export default function App() {
  return (
    <ThemeProvider>
      <BookingProvider>
        {/* Mounts hot toast container inside root layer safely */}
        <Toaster position="top-right" reverseOrder={false} />
        <RouterProvider router={router} />
      </BookingProvider>
    </ThemeProvider>
  );
}