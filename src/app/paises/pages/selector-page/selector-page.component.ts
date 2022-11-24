import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from "rxjs/operators";

import { PaisesService } from '../../services/paises.service';

import { PaisSmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.formBuilder.group({
    continentes: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  })

  // Llenar selectores
  continentes: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: PaisSmall[] = [];

  cargando: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private paisesService: PaisesService ) { }

  ngOnInit(): void {

    this.continentes = this.paisesService.continentes;

    // Cuando cambie el continente
    this.miFormulario.get('continentes')?.valueChanges
      .pipe(
        tap(( _ ) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap(continentes => this.paisesService.getPaisesPorContinente(continentes))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
      })

    // Cuando cambie el país
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(() => {
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap(codigo => this.paisesService.getPaisesPorCodigo(codigo)),
        switchMap(pais => this.paisesService.getPaisesPorBorders(pais?.borders!))
      )
      .subscribe(paises => {
        this.fronteras = paises;
        this.cargando = false;
      })
  }

  guardar() {
    
  }

}
