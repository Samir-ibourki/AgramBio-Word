import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import './i18n'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'

import { ApolloProvider } from '@apollo/client/react'
import client from './api/apolloClient'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </ApolloProvider>
    </HelmetProvider>
  </StrictMode>,
)
