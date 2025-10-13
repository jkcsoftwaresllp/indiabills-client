import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const TransportList = lazy(() => import('../pages/transport/ViewTransport'));
const AddTransport = lazy(() => import('../pages/transport/AddTransport'));
const InspectTransport = lazy(() => import('../pages/transport/InspectTransport'));
const EditTransport = lazy(() => import('../pages/transport/EditTransport'));

const TransportRoutes = () => {
  return [
    <Route
      key="transport"
      path="/transport"
      element={
        <ProtectedRoute
          element={TransportList}
          roles={['admin', 'operators', 'delivery']}
        />
      }
    />,
    <Route
      key="transport-add"
      path="/transport/add"
      element={
        <ProtectedRoute
          element={AddTransport}
          roles={['admin', 'operators', 'delivery']}
        />
      }
    />,
    <Route
      key="transport-inspect"
      path="/transport/:transportId"
      element={
        <ProtectedRoute
          element={InspectTransport}
          roles={['admin', 'operators', 'Delivery']}
        />
      }
    />,
    <Route
      key="transport-edit"
      path="/transport/:id/edit"
      element={
        <ProtectedRoute
          element={EditTransport}
          roles={['admin', 'operators']}
        />
      }
    />
  ];
};

export default TransportRoutes;