import http from "../http-common";
import type { NextApiRequest, NextApiResponse } from 'next'
import ButtonData from "../types/button.type"


class ButtonDataService {
  getAll() {
    return http.get("/buttons");
  }

  get(id: string) {
    return http.get(`/buttons/${id}`);
  }

  create(data: ButtonData) {
    return http.post("/buttons", data);
  }

  update(data: ButtonData, id: any) {
    return http.put(`/buttons/${id}`, data);
  }

  delete(id: any) {
    return http.delete(`/buttons/${id}`);
  }

  deleteAll() {
    return http.delete(`/buttons`);
  }

  // findByTag(tag: string) {
  //   return http.get(`/buttons?tag=${tag}`);
  // }
}

//////try with next api response
//
// export default (req: NextApiRequest, res: NextApiResponse) => {
//
//   createButton: async function(id) {
//     try {
//         const response = await axios.post(BASE_URL+'api/buttons/new', AUTH_API_CONFIG);
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
//         const response = await axios.get(BASE_URL+'api/buttons', AUTH_API_CONFIG);
//         return response.data;
//
//     } catch (error) {
//       throw error;
//     }
//   },
        // axios.get('http://localhost:3001/buttons/new').then((res) => {
        //   res.data.map((button) => {
        //     console.log(button.name);
        //   });
        // }).catch(() => console.log('ERRRO'));
// }
