import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiHelper {
  private readonly apiKey = environment.rapidApiKey;

  constructor(private http: HttpClient) {}

  get<T>(url: string, host: string, params?: any): Observable<T> {
    const headers = new HttpHeaders({
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': host,
    });

    return this.http.get<T>(url, { headers, params });
  }
}
