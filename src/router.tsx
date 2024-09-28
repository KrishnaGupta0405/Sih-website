// router.tsx (Without Lazy Loading)
import { createBrowserRouter } from 'react-router-dom';
import GeneralError from './pages/errors/general-error';
import NotFoundError from './pages/errors/not-found-error';
import MaintenanceError from './pages/errors/maintenance-error';
import UnauthorisedError from './pages/errors/unauthorised-error.tsx';
import ProtectedRoute from './ProtectedRoute';

import AppShell from './components/app-shell';
import Dashboard from './pages/dashboard';
import Tasks from '@/pages/tasks';
import Chats from '@/pages/chats';
import Apps from '@/pages/apps';
import ComingSoon from '@/components/coming-soon';
import ExtraComponents from './pages/extra-components';
import Settings from './pages/settings';
import Profile from './pages/settings/profile';
import Account from './pages/settings/account';
import Appearance from './pages/settings/appearance';
import Notifications from './pages/settings/notifications';
import Display from './pages/settings/display';
import ErrorExample from './pages/settings/error-example';
import SignIn from './pages/auth/sign-in.tsx';
import SignIn2 from './pages/auth/sign-in-2.tsx';
import SignUp from './pages/auth/sign-up.tsx';
import ForgotPassword from './pages/auth/forgot-password.tsx';
import Otp from './pages/auth/otp.tsx';
import Intro from './pages/Intro.tsx';

// For levelsCompleted-> +10 pts.
// For modulesCompleted-> +5pts.
const router = createBrowserRouter([
  // Auth routes
  { path: '/sign-in', element: <SignIn /> },
  { path: '/sign-in-2', element: <SignIn2 /> },
  { path: '/sign-up', element: <SignUp /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/otp', element: <Otp /> },
  { path: '/intro', element: <Intro/> },
  // Main routes
  {
    path: '/',
    element: <AppShell />,
    errorElement: <GeneralError />,
    children: [
      { index: true, element: <ProtectedRoute component={Dashboard} /> },
      { path: 'tasks', element: <ProtectedRoute component={Tasks} /> },
      { path: 'chats', element: <ProtectedRoute component={Chats} /> },
      { path: 'apps', element: <ProtectedRoute component={Apps} /> },
      { path: 'users', element: <ProtectedRoute component={ComingSoon} /> },
      { path: 'analysis', element: <ProtectedRoute component={ComingSoon} /> },
      { path: 'extra-components', element: <ProtectedRoute component={ExtraComponents} /> },
      {
        path: 'settings',
        element: <ProtectedRoute component={Settings} />,
        errorElement: <GeneralError />,
        children: [
          { index: true, element: <ProtectedRoute component={Profile} /> },
          { path: 'account', element: <ProtectedRoute component={Account} /> },
          { path: 'appearance', element: <ProtectedRoute component={Appearance} /> },
          { path: 'notifications', element: <ProtectedRoute component={Notifications} /> },
          { path: 'display', element: <ProtectedRoute component={Display} /> },
          { path: 'error-example', element: <ProtectedRoute component={ErrorExample} errorElement={<GeneralError className='h-[50svh]' minimal />} /> },
        ],
      },
    ],
  },
  // Error routes
  { path: '/500', element: <GeneralError /> },
  { path: '/404', element: <NotFoundError /> },
  { path: '/503', element: <MaintenanceError /> },
  { path: '/401', element: <UnauthorisedError /> },
  // Fallback 404 route
  { path: '*', element: <NotFoundError /> },
]);

export default router;
