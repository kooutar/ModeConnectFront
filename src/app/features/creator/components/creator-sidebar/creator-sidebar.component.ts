import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-creator-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col py-6 px-4 space-y-1 h-screen sticky top-0">
      <div class="px-3 mb-6">
        <span class="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Mon Espace</span>
      </div>

      <nav class="flex flex-col space-y-1 flex-1">
        <a [routerLink]="['/creator']" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="active-link" class="nav-item">
          <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Tableau de bord
        </a>

        <a [routerLink]="['/creator']" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="active-link" class="nav-item">
          <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          Mes modèles
        </a>

        <a [routerLink]="['/creator/orders']" routerLinkActive="active-link" class="nav-item">
          <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          Commandes
        </a>

        <a [routerLink]="['/creator/statistics']" routerLinkActive="active-link" class="nav-item">
          <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          Statistiques
        </a>
      </nav>

      <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-1">
        <a href="#" class="nav-item text-slate-500">
          <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          Paramètres
        </a>
        <button (click)="onLogout()" class="nav-item text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left">
          <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Déconnexion
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .nav-item {
      display: flex;
      items-center: center;
      gap: 12px;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
      color: #475569;
      transition: all 0.2s;
    }
    .nav-item:hover {
      background-color: #f1f5f9;
      color: #0f172a;
    }
    .active-link {
      background-color: var(--primary) !important;
      color: white !important;
      box-shadow: 0 4px 12px rgba(127, 19, 236, 0.2);
    }
    :host-context(.dark) .nav-item {
      color: #94a3b8;
    }
    :host-context(.dark) .nav-item:hover {
      background-color: #1e293b;
      color: white;
    }
    :host-context(.dark) .active-link {
      background-color: var(--primary) !important;
      color: white !important;
    }
  `]
})
export class CreatorSidebarComponent {
  constructor(private router: Router) {}
  
  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
