import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id?: number;
  nombre: string;
  codigo: string;
  email: string;
  password?: string;
}

export interface Professor {
  id?: number;
  nombre: string;
  codigo: string;
  email: string;
  especialidad?: string;
  password?: string;
}

export interface Admin {
  id?: number;
  nombre: string;
  codigo: string;
  email: string;
  password?: string;
}

export interface Curso {
  id?: number;
  nombre: string;
  codigo: string;
  descripcion?: string;
  estado?: 'ACTIVO' | 'INACTIVO';
  profesor?: Professor;
}

export interface DashboardData {
  students: Student[];
  professors: Professor[];
  profesores: Professor[];
  admins: Admin[];
  cursos: Curso[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8083/api/admin';

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/dashboard`);
  }

  // Students CRUD
  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/students`);
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/students`, student);
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/students/${id}`);
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/students/${id}`, student);
  }

  deleteStudent(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/students/${id}`, { responseType: 'text' as 'json' });
  }

  // Professors CRUD
  getAllProfessors(): Observable<Professor[]> {
    return this.http.get<Professor[]>(`${this.apiUrl}/profesores`);
  }

  createProfessor(professor: Professor): Observable<Professor> {
    return this.http.post<Professor>(`${this.apiUrl}/profesores`, professor);
  }

  getProfessor(id: number): Observable<Professor> {
    return this.http.get<Professor>(`${this.apiUrl}/profesores/${id}`);
  }

  updateProfessor(id: number, professor: Professor): Observable<Professor> {
    return this.http.put<Professor>(`${this.apiUrl}/profesores/${id}`, professor);
  }

  deleteProfessor(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/profesores/${id}`, { responseType: 'text' as 'json' });
  }

  // Admins CRUD
  getAllAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.apiUrl}/admins`);
  }

  createAdmin(admin: Admin): Observable<Admin> {
    return this.http.post<Admin>(`${this.apiUrl}/admins`, admin);
  }

  getAdmin(id: number): Observable<Admin> {
    return this.http.get<Admin>(`${this.apiUrl}/admins/${id}`);
  }

  updateAdmin(id: number, admin: Admin): Observable<Admin> {
    return this.http.put<Admin>(`${this.apiUrl}/admins/${id}`, admin);
  }

  deleteAdmin(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/admins/${id}`, { responseType: 'text' as 'json' });
  }

  // Cursos CRUD
  getAllCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/cursos`);
  }

  createCurso(curso: any): Observable<Curso> {
    return this.http.post<Curso>(`${this.apiUrl}/cursos`, curso);
  }

  getCurso(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.apiUrl}/cursos/${id}`);
  }

  updateCurso(id: number, curso: any): Observable<Curso> {
    return this.http.put<Curso>(`${this.apiUrl}/cursos/${id}`, curso);
  }

  deleteCurso(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/cursos/${id}`, { responseType: 'text' as 'json' });
  }
}

