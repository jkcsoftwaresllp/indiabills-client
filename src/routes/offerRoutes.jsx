import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const OfferList = lazy(() => import('../pages/offers/ViewOffer'));
const AddOffer = lazy(() => import('../pages/offers/AddOffer'));
const InspectOffer = lazy(() => import('../pages/offers/InspectOffer'));

const OfferRoutes = () => {
  return (
    <>
      <Route
        path="/offers"
        element={
          <ProtectedRoute
            element={OfferList}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path="/offers/add"
        element={
          <ProtectedRoute
            element={AddOffer}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path="/offers/:offerId"
        element={
          <ProtectedRoute
            element={InspectOffer}
            roles={['admin', 'operators']}
          />
        }
      />
    </>
  );
};

export default OfferRoutes;