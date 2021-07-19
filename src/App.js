import React from "react";
import { useGlobalContext } from "./context";
import Tic from "./Tic";
import Home from "./Home";
function App() {
  const { ready } = useGlobalContext();

  return <>{ready ? <Tic /> : <Home />}</>;
}

export default App;
