import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import Modal from 'react-modal';

Modal.setAppElement('#root');

function App() {
  const routing = useRoutes(routes);
  return <Suspense fallback={<main aria-busy="true" />}>{routing}</Suspense>;
}

export default App;
