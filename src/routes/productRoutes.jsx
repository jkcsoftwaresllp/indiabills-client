import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const ProductList = lazy(() => import('../pages/products/ViewProducts'));
const AddProducts = lazy(() => import('../pages/products/AddProducts'));
const InspectProduct = lazy(() => import('../pages/products/InspectProduct'));

const ProductRoutes = () => {
  return (
    <>
      <Route
        path="/products"
        element={
          <ProtectedRoute
            element={ProductList}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path="/products/add"
        element={
          <ProtectedRoute
            element={AddProducts}
            roles={['admin', 'operators']}
          />
        }
      />
      <Route
        path="/products/:itemId"
        element={
          <ProtectedRoute
            element={InspectProduct}
            roles={['admin', 'operators']}
          />
        }
      />
    </>
  );
};

export default ProductRoutes;