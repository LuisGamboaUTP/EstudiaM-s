import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Professor, Curso } from './admin.service';

export interface ProfesorDashboardData {
  profesor: Professor;
  cursos: Curso[];
}

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {
  private apiUrl = 'http://localhost:8083/api/profesor';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<ProfesorDashboardData> {
    return this.http.get<ProfesorDashboardData>(`${this.apiUrl}/dashboard`);
  }

  getProfile(): Observable<Professor> {
    return this.http.get<Professor>(`${this.apiUrl}/profile`);
  }

  updateProfile(changes: Partial<Professor>): Observable<Professor> {
    return this.http.put<Professor>(`${this.apiUrl}/profile`, changes);
  }
}

