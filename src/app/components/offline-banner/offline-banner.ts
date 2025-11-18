import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CollabService } from '../../core/services/collab.service.ts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offline-banner',
  imports: [CommonModule],
  templateUrl: './offline-banner.html',
  styleUrl: './offline-banner.scss',
})
export class OfflineBanner {
  isOffline$: Observable<boolean>;

  constructor(private collab: CollabService) {
    this.isOffline$ = this.collab.isOffline$;
  }
}
