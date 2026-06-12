import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '../layouts';
import { useAuthContext } from '../state/context/AuthContext';

const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Review = lazy(() => import('../pages/Review'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Settings = lazy(() => import('../pages/Settings'));
const Services = lazy(() => import('../pages/Services'));
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const NotFound = lazy(() => import('../pages/NotFound'));

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black">
    <div className="text-white text-lg animate-pulse">Loading Workspace...</div>
  </div>
);

// Route Guards
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();
  if (loading) return <Loading />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();
  if (loading) return <Loading />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<Loading />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<Loading />}>
            <Contact />
          </Suspense>
        ),
      },
      {
        path: 'services',
        element: (
          <Suspense fallback={<Loading />}>
            <Services />
          </Suspense>
        ),
      },
      {
        path: 'review',
        element: (
          <Suspense fallback={<Loading />}>
            <Review />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: (
          <PublicRoute>
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          </PublicRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <Suspense fallback={<Loading />}>
              <Register />
            </Suspense>
          </PublicRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <PrivateRoute>
            <Suspense fallback={<Loading />}>
              <Dashboard />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <PrivateRoute>
            <Suspense fallback={<Loading />}>
              <Settings />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<Loading />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
