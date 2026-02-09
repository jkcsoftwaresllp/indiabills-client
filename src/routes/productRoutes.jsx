import { lazy } from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './protectedRoutes';
import AddCategory from '../pages/products/category/AddCategory';

const ProductList = lazy(() => import('../pages/products/ViewProducts'));
const AddProducts = lazy(() => import('../pages/products/AddProducts'));
const InspectProduct = lazy(() => import('../pages/products/InspectProduct'));
const EditProduct = lazy(() => import('../pages/products/EditProduct'));

const ProductRoutes = () => {
  return [
    <Route
      key="products"
      path="/products"
      element={
        <ProtectedRoute
          element={ProductList}
          roles={['admin', 'operator']}
        />
      }
    />,
    <Route
      key="products-add"
      path="/products/add"
      element={
        <ProtectedRoute
          element={AddProducts}
          roles={['admin', 'operator']}
        />
      }
    />,
    <Route
      key="products-inspect"
      path="/products/:itemId"
      element={
        <ProtectedRoute
          element={InspectProduct}
          roles={['admin', 'operator']}
        />
      }
    />,
    <Route
      key="products-edit"
      path="/products/:itemId/edit"
      element={
        <ProtectedRoute
          element={EditProduct}
          roles={['admin', 'operator']}
        />
      }
    />,
    <Route
      key="products-category-add"
      path="/products/category/add"
      element={
        <ProtectedRoute
          element={AddCategory}
          roles={['admin', 'operator']}
        />
      }
    />



  ];
};

export default ProductRoutes;