
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
          <input id="title" type="text" formControlName="title" placeholder="Enter task title">
          <div class="error" *ngIf="taskForm.get('title')?.errors?.['required'] && taskForm.get('title')?.touched">
            Title is required
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" formControlName="description" placeholder="Enter task description"></textarea>
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
    /* Container and Card Styles */
    .task-form {
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      padding: 30px;
      margin: 40px auto;
      max-width: 500px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    .task-form h2 {
      text-align: center;
      margin-bottom: 25px;
      font-size: 26px;
      color: #333;
    }

    /* Form Group Styling */
    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #444;
    }
    
    /* Input, Textarea and Select Field Styling */
    input, 
    textarea, 
    select {
      width: 100%;
      padding: 12px;
      font-size: 15px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      transition: border-color 0.3s ease;
    }
    
    input:focus, 
    textarea:focus, 
    select:focus {
      border-color: #0056b3;
      outline: none;
    }

    /* Error Message Styling */
    .error {
      margin-top: 5px;
      color: #d9534f;
      font-size: 13px;
    }

    /* Button Styling */
    button {
      width: 100%;
      padding: 14px;
      background-color: #0056b3;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      color: #fff;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    
    button:hover:not(:disabled) {
      background-color: #003f7f;
    }
    
    button:disabled {
      background-color: #a0c8f0;
      cursor: not-allowed;
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
        this.taskService.updateTask(this.taskId, task).subscribe(
          updatedTask => {
            console.log('Task updated:', updatedTask);
            this.router.navigate(['/tasks']);
          },
          error => console.error('Error updating task:', error)
        );
      } else {
        this.taskService.createTask(task).subscribe(
          response => {
            console.log('Task created:', response);
            this.taskForm.reset();
            this.router.navigate(['/tasks']);
          },
          error => console.error('Error creating task:', error)
        );
      }
    }
  }
}
