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
        <div class="logo">
          <h1>Task Management</h1>
        </div>
        <nav>
          <a routerLink="/tasks" routerLinkActive="active-link">Task List</a>
          <a routerLink="/tasks/new" routerLinkActive="active-link">Create Task</a>
        </nav>
      </header>

      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      background-color: #f7f7f7;
      min-height: 100vh;
      box-sizing: border-box;
    }

    header {
      background-color: #fff;
      padding: 20px 30px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .logo h1 {
      font-size: 28px;
      margin: 0;
      color: #0056b3;
    }

    nav {
      display: flex;
      gap: 20px;
    }

    nav a {
      text-decoration: none;
      font-size: 16px;
      font-weight: 500;
      color: #555;
      position: relative;
      transition: color 0.3s ease;
    }

    nav a::after {
      content: '';
      position: absolute;
      width: 0%;
      height: 2px;
      left: 0;
      bottom: -4px;
      background-color: #0056b3;
      transition: width 0.3s ease;
    }

    nav a:hover {
      color: #0056b3;
    }

    nav a:hover::after {
      width: 100%;
    }

    .active-link {
      color: #0056b3;
    }

    main {
      background-color: #fff;
      padding: 20px 30px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    }
  `]
})
export class AppComponent {
  title = 'Task Management';
}