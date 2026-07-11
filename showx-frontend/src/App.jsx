// src/App.jsx
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BookingProvider } from './context/BookingContext';
import { ThemeProvider } from './context/ThemeContext';
import './components/styles/DashboardLayout.css';

import MainLayout from './components/templates/MainLayout';
import AuthLayout from './components/templates/AuthLayout';
import NotFound from './pages/NotFound';

import ProtectedRoute from './components/organisms/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const MovieListing = lazy(() => import('./pages/MovieListing'));
const Theatres = lazy(() => import('./pages/Theatres'));
const Releases = lazy(() => import('./pages/Releases'));
const MovieDetails = lazy(() => import('./pages/MovieDetails'));
const SelectShow = lazy(() => import('./pages/SelectShow'));
const SelectSeats = lazy(() => import('./pages/SelectSeats'));
const Payment = lazy(() => import('./pages/Payment'));
const Confirmation = lazy(() => import('./pages/Confirmation'));

const Settings = lazy(() => import('./pages/Settings'));
const Support = lazy(() => import('./pages/Support'));

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

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
      { path: 'theatres', element: <Suspense fallback={<PageLoader />}><Theatres /></Suspense> },
      { path: 'releases', element: <Suspense fallback={<PageLoader />}><Releases /></Suspense> },

      { path: 'movies/:movieId', element: <Suspense fallback={<PageLoader />}><MovieDetails /></Suspense> },
      { path: 'movie/:movieId', element: <Suspense fallback={<PageLoader />}><MovieDetails /></Suspense> },

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
      { path: 'reset-password/:token', element: <Suspense fallback={<PageLoader />}><ResetPassword /></Suspense> },
    ]
  },
  {
    path: 'admin',
    element: (
      <ProtectedRoute requireAdmin>
        <Suspense fallback={<PageLoader />}>
          <AdminDashboard />
        </Suspense>
      </ProtectedRoute>
    ),
  }
]);

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <BookingProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <RouterProvider router={router} />
        </BookingProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}