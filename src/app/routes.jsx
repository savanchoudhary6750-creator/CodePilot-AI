import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../layouts';

const Home = lazy(() => import('../pages/Home').then(module => ({ default: module.default })));
const About = lazy(() => import('../pages/About').then(module => ({ default: module.default })));
const Contact = lazy(() => import('../pages/Contact').then(module => ({ default: module.default })));
const Review = lazy(() => import('../pages/Review').then(module => ({ default: module.default })));
const NotFound = lazy(() => import('../pages/NotFound').then(module => ({ default: module.default })));

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black">
    <div className="text-white text-lg">Loading...</div>
  </div>
);

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
        path: 'review',
        element: (
          <Suspense fallback={<Loading />}>
            <Review />
          </Suspense>
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
