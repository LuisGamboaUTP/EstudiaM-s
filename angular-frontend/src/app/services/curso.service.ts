import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private apiUrl = 'http://localhost:8083/api';

  constructor(private http: HttpClient) {}

  getAllCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/cursos`);
  }

  getCursosByProfesor(profesorId: number): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/cursos/profesor/${profesorId}`);
  }

  getCurso(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.apiUrl}/cursos/${id}`);
  }

  createCurso(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(`${this.apiUrl}/cursos`, curso);
  }

  updateCurso(id: number, curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(`${this.apiUrl}/cursos/${id}`, curso);
  }

  deleteCurso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cursos/${id}`);
  }
}

