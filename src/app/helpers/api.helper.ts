import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiHelper {
  private readonly apiKey = environment.rapidApiKey;

  constructor(private http: HttpClient) { }

  /**
 * Realiza una petición HTTP GET tipada contra una API de RapidAPI.
 *
 * Construye los headers requeridos por RapidAPI (`X-RapidAPI-Key` y `X-RapidAPI-Host`)
 * usando la API key almacenada en el servicio y el host recibido por parámetro.
 * Luego delega la llamada al `HttpClient` de Angular y devuelve un `Observable<T>`
 * para que el componente/servicio que la invoque pueda suscribirse.
 *
 * @typeParam T - Tipo de dato esperado en la respuesta (por ejemplo, `WeatherResponse`).
 * @param {string} url - URL completa del endpoint al que se le hará el GET.
 * @param {string} host - Nombre del host de RapidAPI (por ejemplo, `"weatherapi-com.p.rapidapi.com"`).
 * @param {any} [params] - (Opcional) Objeto con parámetros de querystring que se enviarán en la petición.
 * @returns {Observable<T>} Observable que emite la respuesta tipada del endpoint.
 */
  get<T>(url: string, host: string, params?: any): Observable<T> {
    const headers = new HttpHeaders({
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': host,
    });

    return this.http.get<T>(url, { headers, params });
  }

}
