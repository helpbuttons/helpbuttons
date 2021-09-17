import http from "../../http-common";
import ButtonData from "../types/button.type"


class ButtonDataService {

  //catch in componets

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

}
