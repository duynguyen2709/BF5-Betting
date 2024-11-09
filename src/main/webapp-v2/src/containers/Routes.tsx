import { createHashRouter, RouterProvider } from 'react-router-dom'
import routes from '@/commons/routes.ts'
import NotFound from '@/pages/ErrorPage/NotFound.tsx'

const router = createHashRouter([
  {
    path: routes.base,
    element: <div>Base</div>
  },
  {
    path: routes.admin,
    element: <div>Admin</div>
  },
  {
    path: '*',
    element: <NotFound />
  }
])

export default function AppRoutes() {
  return <RouterProvider router={router} />
}
