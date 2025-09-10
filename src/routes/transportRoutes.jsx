import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const TransportList = lazy(() => import('../pages/transport/ViewTransport'));
const AddTransport = lazy(() => import('../pages/transport/AddTransport'));
const InspectTransport = lazy(() => import('../pages/transport/InspectTransport'));

const TransportRoutes = () => {
  return (
    <Routes>
      <Route
        path="transport"
        element={
          <ProtectedRoute
            element={TransportList}
            roles={['admin', 'operators', 'delivery']}
          />
        }
      />
      <Route
        path="transport/add"
        element={
          <ProtectedRoute
            element={AddTransport}
            roles={['admin', 'operators', 'delivery']}
          />
        }
      />
      <Route
        path="transport/:transportId"
        element={
          <ProtectedRoute
            element={InspectTransport}
            roles={['admin', 'operators', 'Delivery']}
          />
        }
      />
    </Routes>
  );
};

export default TransportRoutes;