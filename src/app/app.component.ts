import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <div class="app-container">
      <header>
        <h1>Task Management</h1>
        <nav>
          <a routerLink="/tasks">Task List</a>
          <a routerLink="/tasks/new">Create Task</a>
        </nav>
      </header>

      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      padding: 20px;
    }
    header {
      margin-bottom: 20px;
    }
    nav a {
      margin-right: 10px;
      text-decoration: none;
      color: #333;
    }
    nav a:hover {
      text-decoration: underline;
    }
  `]
})
export class AppComponent {
  title = 'Task Management';
}