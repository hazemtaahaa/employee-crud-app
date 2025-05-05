import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService // Inject ToastrService for notifications
  ) {
    // Initialize the form with validation rules
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if the component is in edit mode by looking for an ID in the route
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.employeeId = +id;
      this.loadEmployee(this.employeeId);
    }
  }

  // Load employee data for editing
  loadEmployee(id: number): void {
    this.employeeService.getById(id).subscribe({
      next: (employee: Employee) => {
        this.employeeForm.patchValue(employee);
      },
      error: () => {
        this.toastr.error('Error loading employee data.');
      }
    });
  }

  // Handle form submission for both create and update operations
  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employeeData: Employee = {
        ...this.employeeForm.value,
        id: this.employeeId || 0
      };

      if (this.isEditMode && this.employeeId) {
        // Update operation
        this.employeeService.update(this.employeeId, employeeData).subscribe({
          next: () => {
            this.toastr.success('Employee updated successfully!');
            this.router.navigate(['/employees']);
          },
          error: (error: any) => {
            if (error.status === 409) {
              this.toastr.error('Email already exists!');
            } else {
              this.toastr.error('Error updating employee.');
            }
          }
        });
      } else {
        // Create operation
        this.employeeService.create(employeeData).subscribe({
          next: () => {
            this.toastr.success('Employee created successfully!');
            this.router.navigate(['/employees']);
          },
          error: (error: any) => {
            if (error.status === 409) {
              this.toastr.error('Email already exists!');
            } else {
              this.toastr.error('Error creating employee.');
            }
          }
        });
      }
    } else {
      // Show a warning if the form is invalid
      this.toastr.warning('Please fill out all required fields.');
    }
  }

  // Handle cancel button click
  onCancel(): void {
    this.router.navigate(['/employees']);
  }
}
