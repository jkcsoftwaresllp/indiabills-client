import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const AuditLogTable = lazy(() => import('../pages/audit/ViewAudit'));

const AuditRoutes = () => {
  return [
    <Route
      key="audit-log"
      path="/audit/log"
      element={
        <ProtectedRoute
          element={AuditLogTable}
          roles={['admin', 'reporter']}
        />
      }
    />
  ];
};

export default AuditRoutes;