import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const ViewUsers = lazy(() => import('../pages/user/ViewUser'));
const AddUser = lazy(() => import('../pages/user/AddUser'));
const InspectUser = lazy(() => import('../pages/user/InspectUser'));

const UserRoutes = () => {
  return (
    <>
      <Route
        path="/users"
        element={<ProtectedRoute element={ViewUsers} roles={['admin']} />}
      />
      <Route
        path="/users/add"
        element={<ProtectedRoute element={AddUser} roles={['admin']} />}
      />
      <Route
        path="/users/:userID"
        element={<ProtectedRoute element={InspectUser} roles={['admin']} />}
      />
    </>
  );
};

export default UserRoutes;