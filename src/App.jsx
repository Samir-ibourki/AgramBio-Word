import Header from "./components/Header";
import Hero from "./components/Hero";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimationProvider,  } from "./context/AnimationContext";
import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import About from "./components/About";

const Category = lazy(() => import("./components/Category"));
const Products = lazy(() => import("./components/Products"));
const Shop = lazy(() => import("./components/Shop"));
const ProductDetails = lazy(() => import("./components/ProductDetails"));
const Contact = lazy(() => import("./components/Contact"));
const Features = lazy(() => import("./components/Features"));


const queryClient = new QueryClient();

function App() {
  return (
    <>
   
     <QueryClientProvider client={queryClient}>
      <AnimationProvider>
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

          </Routes>  

            
      </main>
      
      </AnimationProvider>
    </QueryClientProvider>
    </>
  )
}

export default App;
