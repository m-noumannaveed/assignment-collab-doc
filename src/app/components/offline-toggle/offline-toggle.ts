import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CollabService } from '../../core/services/collab.service.ts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offline-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offline-toggle.html',
  styleUrl: './offline-toggle.scss',
})
export class OfflineToggle {
  isOffline$: Observable<boolean>;

  constructor(private collab: CollabService) {
    this.isOffline$ = this.collab.isOffline$;
  }

  toggleOffline(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.collab.setOfflineMode(checked);
  }
}
