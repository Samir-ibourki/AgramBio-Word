import { createContext, useContext, useState } from 'react';

const AnimationContext = createContext();

export function AnimationProvider({ children }) {
  const [isReady, setIsReady] = useState(false);

  return (
    <AnimationContext.Provider value={{ isReady, setIsReady }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}
