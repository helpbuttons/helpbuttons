import { BehaviorSubject, Observable } from 'rxjs';


import {
  localStorageService,
  LocalStorageVars,
} from 'services/LocalStorage';
import getConfig from 'next/config';
import { rxjsHelper } from 'shared/helpers/rxjs.helper';
import dconsole from 'shared/debugger';

export function isHttpError(err: object) {
  return err && err.statusCode && err.message;
}

export class HttpService {
  public isAuthenticated$ = new BehaviorSubject(false);

  private apiUrl: string;
  private accessToken?: string;

  //TO DO : CHANGE CONSTRUCTOR TO FUNCTION INJECTION
  constructor() {
    this.accessToken = localStorageService.read(
      LocalStorageVars.ACCESS_TOKEN,
    );
    if (this.accessToken) {
      this.isAuthenticated$.next(true);
    }
    const { publicRuntimeConfig } = getConfig();
    this.apiUrl = `${publicRuntimeConfig.apiUrl}/`;
  }
  public getAccessToken() {
    return localStorageService.read(LocalStorageVars.ACCESS_TOKEN);
  }
  public setAccessToken(accessToken?: string) {
    // dconsole.log('setting up new token ' + accessToken)
    localStorageService.save(
      LocalStorageVars.ACCESS_TOKEN,
      accessToken.toString(),
    );
    this.isAuthenticated$.next(true);
  }

  public clearAccessToken() {
    dconsole.log('cleaning access token');
    localStorageService.remove(LocalStorageVars.ACCESS_TOKEN);
    this.isAuthenticated$.next(false);
  }

  public delete<T>(
    path: string,
    body: object = {},
    headers: object = {},
    keepPath: boolean = false,
  ): Observable<T | undefined> {
    path = this.bodyToPath(path, body);
    path = this.correctApiPath(path, keepPath);
    headers = this.addTokenToHeaders(headers)
    return rxjsHelper.delete(path, headers);
  }

  public get<T>(
    path: string,
    body: object = {},
    headers: object = {},
    keepPath: boolean = false,
  ): Observable<T | undefined> {
    path = this.bodyToPath(path, body);
    path = this.correctApiPath(path, keepPath);
    headers = this.addTokenToHeaders(headers)
    return rxjsHelper.get(path, headers);
  }

  public post<T>(
    path: string,
    body: object = {},
    headers: object = {},
    keepPath: boolean = false,
  ): Observable<T | undefined> {
    path = this.correctApiPath(path, keepPath);
    
    // Check if body is FormData - don't set accept header for multipart form data
    const isFormData = body instanceof FormData;
    headers = isFormData 
      ? this.addTokenToHeadersWithoutAccept(headers)
      : this.addTokenToHeaders(headers);
      
    return rxjsHelper.post(path, body, headers);
  }

  /**
   * Converts an object with optional file arrays into FormData
   * @param data - Object containing the data fields
   * @param fileFieldNames - Array of field names that contain files (e.g., ['images', 'logo', 'jumbo'])
   * @returns FormData object
   */
  public static toFormData(
    data: Record<string, any>,
    fileFieldNames: string[] = []
  ): FormData {
    const formData = new FormData();
    
    // Build data fields - filter out File objects from JSON, keep only strings
    const dataFields: Record<string, any> = {};
    Object.keys(data).forEach((key) => {
      if (fileFieldNames.includes(key)) {
        const items = data[key];
        // Handle array of files (e.g., images)
        if (items && Array.isArray(items)) {
          const stringItems = items.filter((item: any) => {
            if (item instanceof File) return false;
            if (item && item.file instanceof File) return false;
            return true;
          });
          dataFields[key] = stringItems;
        } 
        // Handle single file (e.g., logo, jumbo)
        else if (items instanceof File) {
          dataFields[key] = null; // Will be added as file below
        } else if (items && items.file instanceof File) {
          dataFields[key] = null; // Will be added as file below
        } else {
          dataFields[key] = items; // Keep string values
        }
      } else {
        dataFields[key] = data[key];
      }
    });
    
    // Add the data as a JSON string
    formData.append('data', JSON.stringify(dataFields));
    
    // Add files from file fields
    fileFieldNames.forEach((fieldName) => {
      const items = data[fieldName];
      
      // Handle array of files (e.g., images[])
      if (items && Array.isArray(items)) {
        items.forEach((item: any) => {
          let file: File | null = null;
          
          if (item instanceof File) {
            file = item;
          } else if (item && item.file instanceof File) {
            file = item.file;
          }
          
          if (file) {
            formData.append(`${fieldName}[]`, file);
          }
        });
      } 
      // Handle single file (e.g., logo, jumbo)
      else {
        let file: File | null = null;
        
        if (items instanceof File) {
          file = items;
        } else if (items && items.file instanceof File) {
          file = items.file;
        }
        
        if (file) {
          formData.append(fieldName, file);
        }
      }
    });
    
    return formData;
  }

  private addTokenToHeaders(headers): object {
    const accessToken = this.getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return { ...headers, accept: 'application/json' };
  }

  private addTokenToHeadersWithoutAccept(headers): object {
    const accessToken = this.getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return { ...headers };
  }
 
  private bodyToPath(path, body) {
    if (Object.keys(body).length > 0) {
      const query = new URLSearchParams(body);
      const queryString = query.toString();
      path += '?' + queryString;
    }
    return path;
  }

  private correctApiPath(path, keepPath) {
    if (path.indexOf('//') === -1 && !keepPath) {
      path = this.apiUrl + path;
    }
    return path;
  }
}

export const httpService = new HttpService();
