import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MenubarModule, BadgeModule, AvatarModule, InputTextModule, RippleModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
    isAdminUser: boolean = false;
  constructor(private router: Router) {}
  ngOnInit() {
    this.isAdminUser = this.isAdmin();
  }

  isAdmin(): boolean {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.role === "Admin";
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        return false;
      }
    }
    return false;
  }

   isAdminToLogOut(): boolean {
    return localStorage.getItem('role') === 'admin';
  }

  logout(): void {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');

    this.router.navigate(['/login']);
    window.location.reload();
  }
}
