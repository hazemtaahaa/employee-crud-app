import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Employee } from '../models/employee';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  // Get all employees
  getAll(): Observable<Employee[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  // Get employee by ID
  getById(id: number): Observable<Employee> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  // Create a new employee
  create(employee: Employee): Observable<Employee> {
    return this.http.post<any>(this.apiUrl, employee).pipe(
      map(response => response.data)
    );
  }

  // Update employee
  update(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, employee).pipe(
      map(response => response.data)
    );
  }

  // Delete employee
  delete(id: number): Observable<boolean> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.success) 
    );
  }
}
