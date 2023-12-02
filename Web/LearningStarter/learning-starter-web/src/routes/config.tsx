import { Route, Routes as Switch, Navigate } from "react-router-dom";
import { LandingPage } from "../pages/landing-page/landing-page";
import { NotFoundPage } from "../pages/not-found";
import { useUser } from "../authentication/use-auth";
import { UserPage } from "../pages/user-page/user-page";
import { RegisterPage } from "../pages/register-page/register-page";
import { PageWrapper } from "../components/page-wrapper/page-wrapper";
import { routes } from ".";
import { ProductPage } from "../pages/product-page/product-page";

import { CartPage } from "../pages/cart/cart";
import { ProductDetailPage } from "../pages/shop-page/product-detail";
import { CartConfirmation } from "../pages/cart/cart-success";
import { ShopPage } from "../pages/shop-page/shop-page";
import { ProductEditPage } from "../pages/product-page/ProductEditPage";
import { AboutUsPage } from "../pages/aboutus-page/aboutUs-page";
import {ViewMyOrderPage}  from "../pages/user-page/view-my-orders";

//This is where you will tell React Router what to render when the path matches the route specified.
export const Routes = () => {
  //Calling the useUser() from the use-auth.tsx in order to get user information
  const user = useUser();
  return (
    <>
      {/* The page wrapper is what shows the NavBar at the top, it is around all pages inside of here. */}
      <PageWrapper user={user}>
        <Switch>
          {/* When path === / render LandingPage */}
          <Route path={routes.home} element={<LandingPage />} />
          {/* When path === /user render UserPage */}
          <Route path={routes.user} element={<UserPage />} />
          {/* Going to route "localhost:5001/" will go to homepage */}
          <Route path={routes.root} element={<Navigate to={routes.home} />} />
          <Route path={routes.shop} element={<ShopPage />} />
          <Route path={routes.aboutus} element={<AboutUsPage />} />
          <Route path={routes.register} element={<RegisterPage />} />
          <Route path={routes.cart} element={<CartPage />} />
          <Route path={routes.product} element={<ProductPage />} />
          <Route path={routes.productDetail} element={<ProductDetailPage />} />
          <Route path={routes.productEdit} element={<ProductEditPage />} />
          <Route path={routes.viewMYOrder} element={<ViewMyOrderPage />} />

          <Route path={routes.cartConfirm} element={<CartConfirmation />} />
          {/* This should always come last.  
            If the path has no match, show page not found */}
          <Route path="*" element={<LandingPage />} />
        </Switch>
      </PageWrapper>
    </>
  );
};
