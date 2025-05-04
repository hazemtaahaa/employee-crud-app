import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';  // Add this import

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: number | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.employeeId = +id;
      this.loadEmployee(this.employeeId);
    }
  }

  loadEmployee(id: number): void {
    this.employeeService.getById(id).subscribe({
      next: (employee: Employee) => {
        this.employeeForm.patchValue({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          position: employee.position
        });
      },
      error: (error: any) => {
        this.errorMessage = 'Error loading employee';
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employeeData: Employee = {
        ...this.employeeForm.value,
        id: this.employeeId || 0
      };
      
      if (this.isEditMode && this.employeeId) {
        this.employeeService.update(this.employeeId, employeeData).subscribe({
          next: () => {
            this.router.navigate(['/employees']);
          },
          error: (error: any) => {
            this.errorMessage = 'Error updating employee';
            console.error(error);
          }
        });
      } else {
        this.employeeService.create(employeeData).subscribe({
          next: () => this.router.navigate(['/employees']),
          error: (error: any) => {
            this.errorMessage = 'Error creating employee';
            console.error(error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }
}
