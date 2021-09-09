///button icon over the map
import http from "../http-common";
import type { NextApiRequest, NextApiResponse } from 'next'
import NetworkData from "../types/button.type"


class NetworkDataService {
  getAll() {
    return http.get("/networks");
  }

  get(id: string) {
    return http.get(`/networks/${id}`);
  }

  create(data: ButtonData) {
    return http.post("/networks", data);
  }

  update(data: ButtonData, id: any) {
    return http.put(`/networks/${id}`, data);
  }

  delete(id: any) {
    return http.delete(`/networks/${id}`);
  }

  deleteAll() {
    return http.delete(`/networks`);
  }

  // findByTag(tag: string) {
  //   return http.get(`/networks?tag=${tag}`);
  // }
}

//////try with next api response
//
// export default (req: NextApiRequest, res: NextApiResponse) => {
//
//   createButton: async function(id) {
//     try {
//         const response = await axios.post(BASE_URL+'api/networks/new', AUTH_API_CONFIG);
//         return response.data;
//
//     } catch (error) {
//       throw error;
//     }
//   },
//
//   getButton: async function(id) {
//     try {
//         const response = await axios.get(BASE_URL+'api/user/'+id, AUTH_API_CONFIG);
//         return response.data;
//
//     } catch (error) {
//       throw error;
//     }
//   },
//
//   getButtonList: async function(id) {
//     try {
//         const response = await axios.get(BASE_URL+'api/networks', AUTH_API_CONFIG);
//         return response.data;
//
//     } catch (error) {
//       throw error;
//     }
//   },
        // axios.get('http://localhost:3001/networks/new').then((res) => {
        //   res.data.map((button) => {
        //     console.log(button.name);
        //   });
        // }).catch(() => console.log('ERRRO'));
// }
