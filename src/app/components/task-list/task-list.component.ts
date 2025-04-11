
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import the Router
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
     <div class="task-list-container">
      <div class="card">
        <h2 class="card-header">Tasks</h2>
        
        <div class="filters">
          <label for="statusFilter">Filter by status:</label>
          <select id="statusFilter" [(ngModel)]="selectedStatus" (change)="filterTasks()">
            <option value="">All</option>
            <option value="TO_DO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <table class="tasks-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let task of filteredTasks">
              <td>{{ task.title }}</td>
              <td>{{ task.description }}</td>
              <td>{{ task.status }}</td>
              <td>
                <button class="edit-btn" (click)="editTask(task)">Edit</button>
                <button class="delete-btn" (click)="deleteTask(task.id!)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .task-list-container {
      display: flex;
      justify-content: center;
      padding: 30px 15px;
      background: #f5f5f5;
      min-height: 100vh;
    }

    .card {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 900px;
      padding: 20px;
    }

    .card-header {
      text-align: center;
      margin-bottom: 20px;
      font-size: 28px;
      color: #333;
    }

    .filters {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    
    .filters label {
      font-weight: 600;
      color: #555;
    }
    
    .filters select {
      padding: 8px 12px;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 4px;
      outline: none;
      transition: border-color 0.3s ease;
    }
    
    .filters select:focus {
      border-color: #0056b3;
    }
    
    .tasks-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .tasks-table th, .tasks-table td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
      text-align: left;
    }
    
    .tasks-table th {
      background-color: #f0f0f0;
      font-weight: 600;
    }
    
    .tasks-table tbody tr:hover {
      background-color: #f9f9f9;
    }
    
    button {
      padding: 8px 12px;
      font-size: 14px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin-right: 5px;
    }
    
    .edit-btn {
      background-color: #0056b3;
      color: #fff;
    }
    
    .edit-btn:hover {
      background-color: #003f7f;
    }
    
    .delete-btn {
      background-color: #d9534f;
      color: #fff;
    }
    
    .delete-btn:hover {
      background-color: #c12e2a;
    }
    
    @media (max-width: 768px) {
      .tasks-table th, .tasks-table td {
        font-size: 13px;
        padding: 10px;
      }
      .card-header {
        font-size: 24px;
      }
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedStatus: string = '';

  constructor(private taskService: TaskService, private router: Router) {}  // Inject Router

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(
      tasks => {
        this.tasks = tasks;
        this.filterTasks();
      },
      error => console.error('Error loading tasks:', error)
    );
  }

  filterTasks() {
    this.filteredTasks = this.selectedStatus
      ? this.tasks.filter(task => task.status === this.selectedStatus)
      : this.tasks;
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(
      () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.filterTasks();
      },
      error => console.error('Error deleting task:', error)
    );
  }

  editTask(task: Task) {
    // Navigate to the edit page with the task ID
    this.router.navigate(['/tasks/edit', task.id]);
  }
}
