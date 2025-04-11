// src/app/components/task-list/task-list.component.ts

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
    <div class="task-list">
      <h2>Tasks</h2>
      
      <div class="filters">
        <select [(ngModel)]="selectedStatus" (change)="filterTasks()">
          <option value="">All</option>
          <option value="TO_DO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      <table>
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
              <button (click)="editTask(task)">Edit</button>
              <button (click)="deleteTask(task.id!)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .task-list {
      padding: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 10px;
      border: 1px solid #ddd;
    }
    .filters {
      margin-bottom: 20px;
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
