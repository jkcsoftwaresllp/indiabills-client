import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';

const ProductList = lazy(() => import('../pages/products/ViewProducts'));
const AddProducts = lazy(() => import('../pages/products/AddProducts'));
const InspectProduct = lazy(() => import('../pages/products/InspectProduct'));

const ProductRoutes = () => {
  return [
    <Route
      key="products"
      path="/products"
      element={
        <ProtectedRoute
          element={ProductList}
          roles={['admin', 'operators']}
        />
      }
    />,
    <Route
      key="products-add"
      path="/products/add"
      element={
        <ProtectedRoute
          element={AddProducts}
          roles={['admin', 'operators']}
        />
      }
    />,
    <Route
      key="products-inspect"
      path="/products/:itemId"
      element={
        <ProtectedRoute
          element={InspectProduct}
          roles={['admin', 'operators']}
        />
      }
    />
  ];
};

export default ProductRoutes;