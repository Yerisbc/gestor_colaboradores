import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ColaboradorService } from '../../services/colaborador.service';
import { Colaborador, ColaboradorWithRisk } from '../../models/colaborador.model';

@Component({
  selector: 'app-colaboradores',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './colaboradores.component.html',
  styleUrl: './colaboradores.component.css'
})
export class ColaboradoresComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'idcolaborador',
    'nombre',
    'apellidos', 
    'edad',
    'sexo',
    'profesion',
    'estadoCivil',
    'area',
    'nivelRiesgo',
    'acciones'
  ];
  
  dataSource = new MatTableDataSource<ColaboradorWithRisk>();
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private colaboradorService: ColaboradorService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadColaboradores();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadColaboradores(): void {
    this.isLoading = true;
    this.colaboradorService.getColaboradoresWithRisk().subscribe({
      next: (colaboradores) => {
        this.dataSource.data = colaboradores;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.showMessage('Error al cargar colaboradores: ' + error.message, 'error');
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  showNivelRiesgo(colaborador: ColaboradorWithRisk): void {
    const message = `Nivel de riesgo para ${colaborador.nombre} ${colaborador.apellidos}: ${colaborador.nivelRiesgo}`;
    this.showMessage(message, 'info');
  }

  editColaborador(colaborador: Colaborador): void {
    this.router.navigate(['/colaboradores/editar', colaborador.idcolaborador]);
  }

  deleteColaborador(colaborador: Colaborador): void {
    if (confirm(`¿Está seguro de eliminar a ${colaborador.nombre} ${colaborador.apellidos}?`)) {
      this.colaboradorService.deleteColaborador(colaborador.idcolaborador!).subscribe({
        next: () => {
          this.showMessage('Colaborador eliminado exitosamente', 'success');
          this.loadColaboradores();
        },
        error: (error) => {
          this.showMessage('Error al eliminar colaborador: ' + error.message, 'error');
        }
      });
    }
  }

  addColaborador(): void {
    this.router.navigate(['/colaboradores/nuevo']);
  }

  getRiskColor(nivelRiesgo: string): string {
    switch (nivelRiesgo) {
      case 'FUERA DE PELIGRO':
        return 'green';
      case 'TENGA CUIDADO, TOME TODAS LAS MEDIDAS DE PREVENCIÓN':
        return 'orange';
      case 'POR FAVOR QUEDARSE EN CASA':
        return 'red';
      default:
        return 'gray';
    }
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: type === 'info' ? 4000 : 3000,
      panelClass: `${type}-snackbar`
    });
  }
}
