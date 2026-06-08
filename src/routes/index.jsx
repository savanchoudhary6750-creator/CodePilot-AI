import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Services = lazy(() => import('../pages/Services'));
const Contact = lazy(() => import('../pages/Contact'));
const Review = lazy(() => import('../pages/Review'));
const NotFound = lazy(() => import('../pages/NotFound'));

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    Loading...
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<Loading />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: '/about',
    element: (
      <Suspense fallback={<Loading />}>
        <About />
      </Suspense>
    ),
  },
  {
    path: '/services',
    element: (
      <Suspense fallback={<Loading />}>
        <Services />
      </Suspense>
    ),
  },
  {
    path: '/contact',
    element: (
      <Suspense fallback={<Loading />}>
        <Contact />
      </Suspense>
    ),
  },
  {
    path: '/review',
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
]);

export default router;