import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';

import { Button } from './button.type';


export class ButtonDataService {


  public static getAll(): Observable<Button> {
    return ajax.get(`http://localhost:3001/buttons`);
  }

  public static get(id: string): Observable<Button> {
    return ajax.get(`http://localhost:3001/buttons/${id}`);
  }

  public static create(data: Button): Observable<Button> {
    return ajax.post(`http://localhost:3001/buttons`,data);
  }

  public static update(data: Button, id:any): Observable<Button> {
    return ajax.put(`http://localhost:3001/buttons/${id}`,data);
  }

  public static delete(id:any): Observable<Button> {
    return ajax.delete(`http://localhost:3001/buttons/${id}`);
  }

  public static deleteAll(id:any): Observable<Button> {
    return ajax.delete(`http://localhost:3001/buttons`);
  }


}
