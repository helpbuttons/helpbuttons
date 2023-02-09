import router from "next/router";
import { store } from "pages";
import Configuration from "pages/Configuration";
import { useEffect } from "react";
import { FetchDefaultNetwork } from "state/Networks";

// name, description, logo, background image, button template, color pallete, colors
export default NetworkCreation;

function NetworkCreation() {
  
 
  useEffect(() => {
    store.emit(new FetchDefaultNetwork(() => {
      router.push({
        pathname: '/HomeInfo',
      });
    },
    (error) => {
      // do nothing, let the user configure the network
    },));
    
  }, [])
  return (
    <Configuration></Configuration>
  );
}
