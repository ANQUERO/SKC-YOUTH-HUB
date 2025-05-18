import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/shoelace.js';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import './index.css'
import App from './App.jsx'

import AdminAuth from '@pages/AdminAuth/index.jsx';
import NotFound from '@pages/NotFound/index.jsx';

const router = createBrowserRouter([
  {path:"/", element:<App/>},
  {path:"/adminAuth", element:<AdminAuth/>},
  {path:"*", element:<NotFound/>},

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
