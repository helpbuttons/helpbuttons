import { createContext, useContext, useEffect, useState } from "react";

export const ClienteSideRendering = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return (<>
    {isClient && children}</>
  );
};