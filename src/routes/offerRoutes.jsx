import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const OfferList = lazy(() => import('../pages/offers/ViewOffer'));
const AddOffer = lazy(() => import('../pages/offers/AddOffer'));
const InspectOffer = lazy(() => import('../pages/offers/InspectOffer'));

const OfferRoutes = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <ProtectedRoute
            element={OfferList}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path="add"
        element={
          <ProtectedRoute
            element={AddOffer}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path=":offerId"
        element={
          <ProtectedRoute
            element={InspectOffer}
            roles={['admin', 'operators']}
          />
        }
      />
    </Routes>
  );
};

export default OfferRoutes;