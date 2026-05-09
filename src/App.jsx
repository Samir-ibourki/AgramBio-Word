import Header from "./components/Header";
import Hero from "./components/Hero";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimationProvider,  } from "./context/AnimationContext";
import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import About from "./components/About";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";


import Category from "./components/Category";
import Products from "./components/Products";
const Shop = lazy(() => import("./components/Shop"));
const ProductDetails = lazy(() => import("./components/ProductDetails"));
const Checkout = lazy(() => import("./components/Checkout"));
const Contact = lazy(() => import("./components/Contact"));
const Features = lazy(() => import("./components/Features"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./components/TermsOfService"));
const FAQ = lazy(() => import("./components/FAQ"));
const NotFound = lazy(() => import("./components/NotFound"));


import { Helmet } from "react-helmet-async";

import { useQuery } from "@apollo/client/react";
import { getCategories, getProducts } from "./api/queries";

const queryClient = new QueryClient();

function App() {
  useQuery(getCategories);
  useQuery(getProducts, { variables: { first: 8 } });
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
     <Helmet>
        <title>AgramBio | Produits Bio et Naturels Premium</title>
        <meta name="description" content="Découvrez le meilleur des produits naturels et bio du Maroc. Miel pur, Amlou traditionnel et huiles essentielles d'exception." />
      </Helmet>
    <QueryClientProvider client={queryClient}>
      <AnimationProvider>
        <div className="min-h-screen bg-accent selection:bg-gold/30">
          <ScrollToTop />
          <Header />
          {!isHomePage && <div className="h-16 md:h-18" />}
          <Suspense fallback={null}>
            <Routes>
              <Route
                path="/"
                element={
                  <main>
                    <Hero />
                    <Category />
                    <Products />
                  </main>
                }
              />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:slug" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/features" element={<Features />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          <Footer />
        </div>
      </AnimationProvider>
    </QueryClientProvider>
    </>
  );
}

export default App;
