import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  errorMessage: string = '';

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (data: Employee[]) => {
        this.employees = data;
      },
      error: (error: any) => {
        this.errorMessage = 'Error loading employees';
        console.error(error);
      }
    });
  }

  onEdit(id: number): void {
    this.router.navigate(['/employees/edit', id]);
  }

  onAdd(): void {
    this.router.navigate(['/employees/add']);
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.delete(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (error: any) => {
          this.errorMessage = 'Error deleting employee';
          console.error(error);
        }
      });
    }
  }
}
