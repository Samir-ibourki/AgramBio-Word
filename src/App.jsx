import Header from "./components/Header";
import Hero from "./components/Hero";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimationProvider,  } from "./context/AnimationContext";
import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import About from "./components/About";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";


const Category = lazy(() => import("./components/Category"));
const Products = lazy(() => import("./components/Products"));
const Shop = lazy(() => import("./components/Shop"));
const ProductDetails = lazy(() => import("./components/ProductDetails"));
const Checkout = lazy(() => import("./components/Checkout"));
const Contact = lazy(() => import("./components/Contact"));
const Features = lazy(() => import("./components/Features"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./components/TermsOfService"));
const FAQ = lazy(() => import("./components/FAQ"));


import { Helmet } from "react-helmet-async";

const queryClient = new QueryClient();

function App() {
  return (
    <>
     <Helmet>
        <title>AgramBio | Produits Bio et Naturels Premium</title>
        <meta name="description" content="Découvrez la richesse de la nature chez AgramBio. Miels purs, Amlou traditionnel, et huiles cosmétiques certifiées." />
        <meta name="keywords" content="bio, miel naturel, amlou maroc, huiles essentielles, agrambio" />
        <meta property="og:title" content="AgramBio | Produits Bio & Terroir Marocain" />
        <meta property="og:description" content="Le meilleur de la nature livré chez vous. Miels et huiles 100% purs." />
     </Helmet>
     <QueryClientProvider client={queryClient}>
      <AnimationProvider>
        <ScrollToTop />
        <Header/>
        <main>
      
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Category />
                <Products />
                <Features />
              </>
            } />
            
            <Route path="/shop" element={
              <div className="pt-20">
                <Shop />
              </div>
            } />

           <Route path="/checkout" element={
              <Checkout />
            } />


            <Route path="/category/:slug" element={
              <div className="pt-20">
                <Products />
              </div>
            } />

            <Route path="/product/:id" element={
              <div className="pt-20">
                <ProductDetails />
              </div>
            } />

           <Route path="/contact" element={
              <div className="pt-20">
                <Contact />
              </div>
            } />

            <Route path="/about" element={
              <div className="pt-20">
                <About />
              </div>
            } />

            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/faq" element={<FAQ />} />


          </Routes>  

            
      </main>
      <Footer />
      </AnimationProvider>
    </QueryClientProvider>
    </>
  )
}

export default App;
