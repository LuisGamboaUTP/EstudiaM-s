import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from './admin.service';

export interface StudentDashboardData {
  studentName: string;
  activePage: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:8083/api/student';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<StudentDashboardData> {
    return this.http.get<StudentDashboardData>(`${this.apiUrl}/dashboard`);
  }

  getProfile(): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/profile`);
  }

  updateProfile(changes: Partial<Student>): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/profile`, changes);
  }
}

