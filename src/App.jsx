import Header from "./components/Header";
import Hero from "./components/Hero";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimationProvider,  } from "./context/AnimationContext";
import Category from "./components/Category";
import Products from "./components/Products";
const queryClient = new QueryClient();

function App() {
  return (
    <>
   
     <QueryClientProvider client={queryClient}>
      <AnimationProvider>
        <Header/>
        <Hero/>
        <Category/>
        <Products/>
      </AnimationProvider>
    </QueryClientProvider>
    </>
  );
}

export default App;
