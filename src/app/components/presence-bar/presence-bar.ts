import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Collaborator } from '../../core/models/collab.models';
import { CollabService } from '../../core/services/collab.service.ts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-presence-bar',
  imports: [CommonModule],
  templateUrl: './presence-bar.html',
  styleUrl: './presence-bar.scss',
})
export class PresenceBar {
   collaborators$: Observable<Collaborator[]>;

  constructor(private collab: CollabService) {
    this.collaborators$ = this.collab.collaborators$; 
  }
}
