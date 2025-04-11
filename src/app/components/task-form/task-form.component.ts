// src/app/components/task-form/task-form.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="task-form">
      <h2>{{ isEditing ? 'Edit Task' : 'Create Task' }}</h2>
      
      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title</label>
          <input id="title" type="text" formControlName="title">
          <div *ngIf="taskForm.get('title')?.errors?.['required'] && taskForm.get('title')?.touched">
            Title is required
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" formControlName="description"></textarea>
        </div>

        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" formControlName="status">
            <option value="TO_DO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <button type="submit" [disabled]="taskForm.invalid">
          {{ isEditing ? 'Update' : 'Create' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .task-form {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
    }
    input, textarea, select {
      width: 100%;
      padding: 8px;
    }
  `]
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditing = false;
  taskId?: number;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['TO_DO']
    });
  }

  ngOnInit() {
    // Check for the "id" parameter in the URL to determine edit mode
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.taskId = +idParam;
        this.isEditing = true;
        this.loadTask(this.taskId);
      }
    });
  }

  loadTask(id: number) {
    this.taskService.getTaskById(id).subscribe(
      (task: Task) => {
        // Populate the form with the task details
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          status: task.status
        });
      },
      error => {
        console.error('Error loading task details:', error);
      }
    );
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const task: Task = this.taskForm.value;
      
      if (this.isEditing && this.taskId) {
        // Update task
        this.taskService.updateTask(this.taskId, task).subscribe(
          updatedTask => {
            console.log('Task updated:', updatedTask);
            // Navigate back to the task list after update
            this.router.navigate(['/tasks']);
          },
          error => console.error('Error updating task:', error)
        );
      } else {
        // Create new task
        this.taskService.createTask(task).subscribe(
          response => {
            console.log('Task created:', response);
            // Optionally, reset the form or navigate away after creation
            this.taskForm.reset();
            this.router.navigate(['/tasks']);
          },
          error => console.error('Error creating task:', error)
        );
      }
    }
  }
}
