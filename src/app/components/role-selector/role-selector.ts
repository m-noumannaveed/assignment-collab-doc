import { Component } from '@angular/core';
import { CollabService } from '../../core/services/collab.service.ts';
import { Observable } from 'rxjs';
import { Role } from '../../core/models/collab.models.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-role-selector',
  imports: [CommonModule, FormsModule],
  templateUrl: './role-selector.html',
  styleUrl: './role-selector.scss',
})
export class RoleSelector {
  role$: Observable<Role>;

  constructor(private collab: CollabService) {
    this.role$ = this.collab.role$;
  }

  onRoleChange(value: string) {
    this.collab.setRole(value as Role);
  }
}
