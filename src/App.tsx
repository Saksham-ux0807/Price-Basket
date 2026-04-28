/**
 * App — root component.
 *
 * Sets up React Router v6 with a single route:
 *   /  →  SearchPage
 *
 * QueryClientProvider is already provided in src/main.tsx.
 *
 * Requirements: 1.2, 2.6
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SearchPage from './pages/SearchPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SearchPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
