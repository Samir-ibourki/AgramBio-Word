import Header from "./components/Header";
import Hero from "./components/Hero";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimationProvider,  } from "./context/AnimationContext";
const queryClient = new QueryClient();

function App() {
  return (
    <>
   
     <QueryClientProvider client={queryClient}>
      <AnimationProvider>
        <Header/>
    <Hero/>
      </AnimationProvider>
    </QueryClientProvider>
    </>
  );
}

export default App;
