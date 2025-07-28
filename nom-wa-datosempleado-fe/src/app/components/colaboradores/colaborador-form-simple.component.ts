import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ColaboradorService } from '../../services/colaborador.service';
import { ColaboradorCreateRequest, ColaboradorUpdateRequest, Colaborador } from '../../models/colaborador.model';
import { AuthService } from '../../services/auth.service';

// Validador personalizado para edad mínima
function minAgeValidator(minAge: number) {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null; // Si no hay valor, no validamos (required se encarga)
    }
    
    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Ajustar la edad si el cumpleaños no ha pasado este año
    const actualAge = (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) 
      ? age - 1 
      : age;
    
    return actualAge >= minAge ? null : { minAge: { requiredAge: minAge, actualAge } };
  };
}

@Component({
  selector: 'app-colaborador-form-simple',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  styleUrl: './colaborador-form.component.css',
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>{{ isEditMode ? 'edit' : 'person_add' }}</mat-icon>
            {{ isEditMode ? 'Editar Colaborador' : 'Nuevo Colaborador' }}
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="colaboradorForm" (ngSubmit)="onSubmit()">
            
            <!-- Nombre y Apellidos -->
            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="nombre" placeholder="Ingrese el nombre">
                <mat-icon matSuffix>person</mat-icon>
                <mat-error *ngIf="colaboradorForm.get('nombre')?.invalid && colaboradorForm.get('nombre')?.touched">
                  {{getErrorMessage('nombre')}}
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Apellidos</mat-label>
                <input matInput formControlName="apellidos" placeholder="Ingrese los apellidos">
                <mat-icon matSuffix>person_outline</mat-icon>
                <mat-error *ngIf="colaboradorForm.get('apellidos')?.invalid && colaboradorForm.get('apellidos')?.touched">
                  {{getErrorMessage('apellidos')}}
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Email y Teléfono -->
            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" placeholder="ejemplo@correo.com">
                <mat-icon matSuffix>email</mat-icon>
                <mat-error *ngIf="colaboradorForm.get('email')?.invalid && colaboradorForm.get('email')?.touched">
                  {{getErrorMessage('email')}}
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Teléfono</mat-label>
                <input matInput formControlName="telefono" placeholder="12345678" maxlength="8">
                <mat-icon matSuffix>phone</mat-icon>
                <mat-error *ngIf="colaboradorForm.get('telefono')?.invalid && colaboradorForm.get('telefono')?.touched">
                  {{getErrorMessage('telefono')}}
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Fechas -->
            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Fecha de Nacimiento</mat-label>
                <input matInput [matDatepicker]="fechaNacimientoPicker" [max]="maxFechaNacimiento" formControlName="fechaNacimiento" placeholder="Seleccione fecha">
                <mat-datepicker-toggle matIconSuffix [for]="fechaNacimientoPicker"></mat-datepicker-toggle>
                <mat-datepicker #fechaNacimientoPicker></mat-datepicker>
                <mat-error *ngIf="colaboradorForm.get('fechaNacimiento')?.invalid && colaboradorForm.get('fechaNacimiento')?.touched">
                  {{getErrorMessage('fechaNacimiento')}}
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Fecha de Ingreso</mat-label>
                <input matInput [matDatepicker]="fechaIngresoPicker" formControlName="fechaIngreso" placeholder="Seleccione fecha">
                <mat-datepicker-toggle matIconSuffix [for]="fechaIngresoPicker"></mat-datepicker-toggle>
                <mat-datepicker #fechaIngresoPicker></mat-datepicker>
                <mat-error *ngIf="colaboradorForm.get('fechaIngreso')?.invalid && colaboradorForm.get('fechaIngreso')?.touched">
                  {{getErrorMessage('fechaIngreso')}}
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Salario -->
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Salario</mat-label>
                <input matInput type="number" formControlName="salario" placeholder="0.00" min="0" step="0.01">
                <span matTextPrefix>$&nbsp;</span>
                <mat-icon matSuffix>attach_money</mat-icon>
                <mat-error *ngIf="colaboradorForm.get('salario')?.invalid && colaboradorForm.get('salario')?.touched">
                  {{getErrorMessage('salario')}}
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Selectores -->
            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Sexo</mat-label>
                <mat-select formControlName="sexoId">
                  <mat-option *ngFor="let sexo of sexos" [value]="sexo.id">
                    {{sexo.nombre}}
                  </mat-option>
                </mat-select>
                <mat-icon matSuffix>wc</mat-icon>
                <mat-error *ngIf="colaboradorForm.get('sexoId')?.invalid && colaboradorForm.get('sexoId')?.touched">
                  {{getErrorMessage('sexoId')}}
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Profesión</mat-label>
                <mat-select formControlName="profesionId">
                  <mat-option *ngFor="let profesion of profesiones" [value]="profesion.id">
                    {{profesion.nombre}}
                  </mat-option>
                </mat-select>
                <mat-icon matSuffix>school</mat-icon>
                <mat-error *ngIf="colaboradorForm.get('profesionId')?.invalid && colaboradorForm.get('profesionId')?.touched">
                  {{getErrorMessage('profesionId')}}
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Estado Civil</mat-label>
                <mat-select formControlName="estadoCivilId">
                  <mat-option *ngFor="let estado of estadosCiviles" [value]="estado.id">
                    {{estado.nombre}}
                  </mat-option>
                </mat-select>
                <mat-icon matSuffix>favorite</mat-icon>
                <mat-error *ngIf="colaboradorForm.get('estadoCivilId')?.invalid && colaboradorForm.get('estadoCivilId')?.touched">
                  {{getErrorMessage('estadoCivilId')}}
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Área</mat-label>
                <mat-select formControlName="areaId">
                  <mat-option *ngFor="let area of areas" [value]="area.id">
                    {{area.nombre}}
                  </mat-option>
                </mat-select>
                <mat-icon matSuffix>business</mat-icon>
                <mat-error *ngIf="colaboradorForm.get('areaId')?.invalid && colaboradorForm.get('areaId')?.touched">
                  {{getErrorMessage('areaId')}}
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Botones -->
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="colaboradorForm.invalid || isLoading">
                <mat-icon>save</mat-icon>
                {{ isEditMode ? 'Actualizar Colaborador' : 'Guardar Colaborador' }}
              </button>
              
              <button mat-button type="button" (click)="onCancel()" [disabled]="isLoading">
                <mat-icon>cancel</mat-icon>
                Cancelar
              </button>
              
              <button mat-button type="button" (click)="goBack()" [disabled]="isLoading">
                <mat-icon>arrow_back</mat-icon>
                Volver
              </button>
            </div>

          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ColaboradorFormSimpleComponent implements OnInit {
  colaboradorForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  colaboradorId: number | null = null;
  maxFechaNacimiento: Date;

  // Datos de prueba para los catálogos
  sexos = [
    { id: 1, nombre: 'Masculino' },
    { id: 2, nombre: 'Femenino' }
  ];

  profesiones = [
    { id: 1, nombre: 'Desarrollador' },
    { id: 2, nombre: 'Diseñador' },
    { id: 3, nombre: 'Analista' },
    { id: 4, nombre: 'Gerente' }
  ];

  estadosCiviles = [
    { id: 1, nombre: 'Soltero' },
    { id: 2, nombre: 'Casado' },
    { id: 3, nombre: 'Divorciado' },
    { id: 4, nombre: 'Viudo' }
  ];

  areas = [
    { id: 1, nombre: 'Tecnología' },
    { id: 2, nombre: 'Recursos Humanos' },
    { id: 3, nombre: 'Finanzas' },
    { id: 4, nombre: 'Marketing' }
  ];

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private colaboradorService: ColaboradorService,
    private authService: AuthService
  ) {
    // Calcular la fecha máxima para personas de 18 años
    const today = new Date();
    this.maxFechaNacimiento = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    this.colaboradorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      fechaNacimiento: ['', [Validators.required, minAgeValidator(18)]],
      fechaIngreso: ['', [Validators.required]],
      salario: ['', [Validators.required, Validators.min(0.01)]],
      sexoId: ['', [Validators.required]],
      profesionId: ['', [Validators.required]],
      estadoCivilId: ['', [Validators.required]],
      areaId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.colaboradorId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.colaboradorId;
    
    if (this.isEditMode && this.colaboradorId) {
      this.loadColaboradorData(this.colaboradorId);
    }
  }

  loadColaboradorData(id: number): void {
    this.isLoading = true;
    
    this.colaboradorService.getColaboradorById(id).subscribe({
      next: (colaborador) => {
        this.isLoading = false;
        
        const fechaNacimiento = colaborador.fechaNacimiento ? new Date(colaborador.fechaNacimiento) : null;
        const fechaIngreso = colaborador.fechaIngreso ? new Date(colaborador.fechaIngreso) : null;
        
        this.colaboradorForm.patchValue({
          nombre: colaborador.nombre,
          apellidos: colaborador.apellidos,
          email: colaborador.email,
          telefono: colaborador.telefono,
          fechaNacimiento: fechaNacimiento,
          fechaIngreso: fechaIngreso,
          salario: colaborador.salario,
          sexoId: colaborador.sexo?.id || '',
          profesionId: colaborador.profesion?.id || '',
          estadoCivilId: colaborador.estadoCivil?.id || '',
          areaId: colaborador.area?.id || ''
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Error al cargar los datos del colaborador', 'Cerrar', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
        this.router.navigate(['/colaboradores']);
      }
    });
  }

  onSubmit(): void {
    if (this.colaboradorForm.valid) {
      const token = this.authService.getToken();
      const isAuthenticated = this.authService.isAuthenticated();
      
      if (!token || !isAuthenticated) {
        this.snackBar.open('Su sesión ha expirado. Por favor, inicie sesión nuevamente.', 'Ir al Login', {
          duration: 5000,
          panelClass: 'error-snackbar'
        }).onAction().subscribe(() => {
          this.router.navigate(['/login']);
        });
        this.router.navigate(['/login']);
        return;
      }
      
      this.isLoading = true;
      
      const formData = this.colaboradorForm.value;
      
      const baseData = {
        ...formData,
        fechaNacimiento: formData.fechaNacimiento instanceof Date 
          ? formData.fechaNacimiento.toISOString().split('T')[0] 
          : formData.fechaNacimiento,
        fechaIngreso: formData.fechaIngreso instanceof Date 
          ? formData.fechaIngreso.toISOString().split('T')[0] 
          : formData.fechaIngreso
      };

      if (this.isEditMode && this.colaboradorId) {
        const colaboradorData: ColaboradorUpdateRequest = {
          idcolaborador: this.colaboradorId,
          nombre: baseData.nombre,
          apellidos: baseData.apellidos,
          email: baseData.email,
          telefono: baseData.telefono,
          fechaNacimiento: baseData.fechaNacimiento,
          fechaIngreso: baseData.fechaIngreso,
          salario: baseData.salario,
          sexoId: baseData.sexoId,
          profesionId: baseData.profesionId,
          estadoCivilId: baseData.estadoCivilId,
          areaId: baseData.areaId
        };

        this.colaboradorService.updateColaborador(colaboradorData).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.snackBar.open('Colaborador actualizado exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
            this.router.navigate(['/colaboradores']);
          },
          error: (error) => {
            this.isLoading = false;
            this.handleError(error);
          }
        });
      } else {
        const colaboradorData: ColaboradorCreateRequest = baseData;

        this.colaboradorService.createColaborador(colaboradorData).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.snackBar.open('Colaborador creado exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
            this.router.navigate(['/colaboradores']);
          },
          error: (error) => {
            this.isLoading = false;
            this.handleError(error);
          }
        });
      }
    } else {
      this.snackBar.open('Por favor, complete todos los campos requeridos', 'Cerrar', {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/colaboradores']);
  }

  goBack(): void {
    this.router.navigate(['/colaboradores']);
  }

  getErrorMessage(field: string): string {
    const control = this.colaboradorForm.get(field);
    if (control?.hasError('required')) {
      return `${this.getFieldLabel(field)} es requerido`;
    }
    if (control?.hasError('email')) {
      return 'Debe ser un email válido';
    }
    if (control?.hasError('pattern')) {
      if (field === 'telefono') {
        return 'El teléfono debe tener 8 dígitos';
      }
      return 'Formato inválido';
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${requiredLength} caracteres`;
    }
    if (control?.hasError('maxlength')) {
      const requiredLength = control.errors?.['maxlength'].requiredLength;
      return `Máximo ${requiredLength} caracteres`;
    }
    if (control?.hasError('min')) {
      const min = control.errors?.['min'].min;
      return `Valor mínimo: ${min}`;
    }
    if (control?.hasError('minAge')) {
      const requiredAge = control.errors?.['minAge'].requiredAge;
      const actualAge = control.errors?.['minAge'].actualAge;
      return `Debe ser mayor de ${requiredAge} años (edad actual: ${actualAge} años)`;
    }
    return '';
  }

  private getFieldLabel(field: string): string {
    const labels: { [key: string]: string } = {
      nombre: 'Nombre',
      apellidos: 'Apellidos',
      email: 'Email',
      telefono: 'Teléfono',
      fechaNacimiento: 'Fecha de Nacimiento',
      fechaIngreso: 'Fecha de Ingreso',
      salario: 'Salario',
      sexoId: 'Sexo',
      profesionId: 'Profesión',
      estadoCivilId: 'Estado Civil',
      areaId: 'Área'
    };
    return labels[field] || field;
  }

  private handleError(error: any): void {
    if (error.message && error.message.includes('Token inválido o expirado')) {
      this.snackBar.open('Su sesión ha expirado. Inicia sesión con: admin@colaboradores.com / admin123', 'Ir al Login', {
        duration: 8000,
        panelClass: 'error-snackbar'
      }).onAction().subscribe(() => {
        this.router.navigate(['/login']);
      });
      this.authService.logout();
    } else {
      this.snackBar.open(error.message || `Error al ${this.isEditMode ? 'actualizar' : 'crear'} el colaborador`, 'Cerrar', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
    }
  }
}
