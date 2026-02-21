import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../env';
import { catchError, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  request(
    method: string,
    endpoint: string,
    data?: any,
    customHeaders?: { [key: string]: string }
  ) {

    const url = `${this.baseUrl}/${endpoint}`;

    let headers = new HttpHeaders();

    // Ajouter headers personnalisés si fournis
    if (customHeaders) {
      Object.keys(customHeaders).forEach(key => {
        headers = headers.set(key, customHeaders[key]);
      });
    }

    const options = { headers };
    let request$;

    switch (method.toUpperCase()) {
      case 'GET':
        request$ = this.http.get(url, options);
        break;

      case 'POST':
        request$ = this.http.post(url, data, options);
        break;

      case 'PUT':
        request$ = this.http.put(url, data, options);
        break;

      case 'DELETE':
        request$ = this.http.delete(url, options);
        break;

      default:
        throw new Error('Unsupported HTTP method');
    }

    // catchError pour propager correctement l'erreur
    return request$.pipe(
      catchError(err => {
        return throwError(() => err);
      })
    );
  }
}
