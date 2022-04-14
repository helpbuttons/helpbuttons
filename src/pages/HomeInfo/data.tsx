import { map, tap, take, catchError } from 'rxjs/operators';

import { NetworkService } from 'services/Networks';
import { INetwork } from 'services/Networks/types';
import { alertService }  from 'services/Alert/index.ts';


 export function GetNetworksEvent (setNetworks) {

   // Anything in here is fired on component mount.
   let networks = NetworkService.find().subscribe(nets => {

     if (nets) {
           // add message to local state if not empty
           setNetworks({ nets: [nets.response] });
       } else {
           // clear messages when empty message received
           setNetworks({ nets: [] });
       }

   });
   return () => {
       // Anything in here is fired on component unmount.
       networks.unsubscribe();
   }

 }

 export function GetNetworkByIdEvent (id, setNetwork) {

   // Call by id to return net.
   let networks = NetworkService.findById(id).subscribe(net => {
      console.log(net.response.name);
     if (net) {
           // return network data
           setNetwork(net.response);
       } else {
           //  return network empty values
           setNetwork();
       }

   });
   return () => {
       // Anything in here is fired on component unmount.
       networks.unsubscribe();
   }

 }
