import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';

import { ButtonData } from './button.type';


export class ButtonDataService {


  public static getAll(): Observable<ButtonData> {
    return ajax.get(`http://localhost:3001/buttons`);
  }

  public static get(id: string): Observable<ButtonData> {
    return ajax.get(`http://localhost:3001/buttons/${id}`);
  }

  public static create(data: ButtonData): Observable<ButtonData> {
    return ajax.post(`http://localhost:3001/buttons`,data);
  }

  public static update(data: ButtonData, id:any): Observable<ButtonData> {
    return ajax.put(`http://localhost:3001/buttons/${id}`,data);
  }

  public static delete(id:any): Observable<ButtonData> {
    return ajax.delete(`http://localhost:3001/buttons/${id}`);
  }

  public static deleteAll(id:any): Observable<ButtonData> {
    return ajax.delete(`http://localhost:3001/buttons`);
  }


}
