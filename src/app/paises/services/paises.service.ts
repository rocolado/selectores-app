import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, Observable, of } from 'rxjs';

import { PaisSmall, Pais } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  
  private baseUrl: string = 'https://restcountries.com/v2';
  private _continentes: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  constructor(private http: HttpClient) { }

  get continentes(): string[] {
    return [...this._continentes];
  }

  getPaisesPorContinente (continente: string): Observable<PaisSmall[]> {
    const url: string = `${this.baseUrl}/region/${continente}?fields=alpha3Code,name`
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisesPorCodigo (codigo: string): Observable<Pais | null> {
    if (!codigo) {
      return of(null)
    }

    const url: string = `${this.baseUrl}/alpha/${codigo}`
    return this.http.get<Pais>(url);
  }

  getPaisesPorCodigoSmall (codigo: string): Observable<PaisSmall> {
    const url: string = `${this.baseUrl}/alpha/${codigo}?fields=alpha3Code,name`;
    return this.http.get<PaisSmall>(url);
  }

  getPaisesPorBorders (borders: string[]): Observable<PaisSmall[]> {
    if (!borders) {
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach(codigo => {
      const peticion = this.getPaisesPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }
}
