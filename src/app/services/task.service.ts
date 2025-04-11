import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8081/api/tasks';

  constructor(private http: HttpClient) {}

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'An error occurred while connecting to the server. ';
    
    if (error.status === 0) {
      errorMessage += 'Please ensure the backend server is running at ' + this.apiUrl;
    } else {
      errorMessage += `Server returned code ${error.status}. `;
      errorMessage += `Error: ${error.error instanceof Error ? error.error.message : JSON.stringify(error.error)}`;
    }
    
    return throwError(() => errorMessage);
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task)
      .pipe(catchError(this.handleError));
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task)
      .pipe(catchError(this.handleError));
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }
}