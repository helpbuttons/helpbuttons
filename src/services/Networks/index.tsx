import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';

import { NetworkData } from './network.type';


export class NetworkDataService {


  public static getAll(): Observable<NetworkData> {
    return ajax.get(`http://localhost:3001/networks`);
  }

  public static get(id: string): Observable<NetworkData> {
    return ajax.get(`http://localhost:3001/networks/${id}`);
  }

  public static create(data: NetworkData): Observable<NetworkData> {
    return ajax.post(`http://localhost:3001/networks`,data);
  }

  public static update(data: NetworkData, id:any): Observable<NetworkData> {
    return ajax.put(`http://localhost:3001/networks/${id}`,data);
  }

  public static delete(id:any): Observable<NetworkData> {
    return ajax.delete(`http://localhost:3001/networks/${id}`);
  }

  public static deleteAll(id:any): Observable<NetworkData> {
    return ajax.delete(`http://localhost:3001/networks`);
  }


}

//////try with next api response
//
// export default (req: NextApiRequest, res: NextApiResponse) => {
//
//   createnetwork: async function(id) {
//     try {
//         const response = await axios.post(BASE_URL+'api/networks/new', AUTH_API_CONFIG);
//         return response.data;
//
//     } catch (error) {
//       throw error;
//     }
//   },
//
//   getnetwork: async function(id) {
//     try {
//         const response = await axios.get(BASE_URL+'api/user/'+id, AUTH_API_CONFIG);
//         return response.data;
//
//     } catch (error) {
//       throw error;
//     }
//   },
//
//   getnetworkList: async function(id) {
//     try {
//         const response = await axios.get(BASE_URL+'api/networks', AUTH_API_CONFIG);
//         return response.data;
//
//     } catch (error) {
//       throw error;
//     }
//   },
        // axios.get('http://localhost:3001/networks/new').then((res) => {
        //   res.data.map((network) => {
        //     console.log(network.name);
        //   });
        // }).catch(() => console.log('ERRRO'));
// }
