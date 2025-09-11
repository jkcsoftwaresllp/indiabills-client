import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const ViewUsers = lazy(() => import('../pages/user/ViewUser'));
const AddUser = lazy(() => import('../pages/user/AddUser'));
const InspectUser = lazy(() => import('../pages/user/InspectUser'));

const UserRoutes = () => {
  return (
    <Routes>
      <Route
        index
        element={<ProtectedRoute element={ViewUsers} roles={['admin']} />}
      />
      <Route
        path="add"
        element={<ProtectedRoute element={AddUser} roles={['admin']} />}
      />
      <Route
        path=":userID"
        element={<ProtectedRoute element={InspectUser} roles={['admin']} />}
      />
    </Routes>
  );
};

export default UserRoutes;