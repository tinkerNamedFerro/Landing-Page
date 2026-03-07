import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Convex setup
import { ConvexProvider, ConvexReactClient } from 'convex/react';

// `convex dev` or your production environment should set
// REACT_APP_CONVEX_URL to the URL of the Convex deployment.
// Create a client with that address.
const convexClient = new ConvexReactClient(
  process.env.REACT_APP_CONVEX_URL
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConvexProvider client={convexClient}>
      <App />
    </ConvexProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
