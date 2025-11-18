import { Injectable, OnDestroy } from '@angular/core';
import { CollabService } from './collab.service.ts';

@Injectable({
  providedIn: 'root',
})
export class PresenceService implements OnDestroy {
  private intervalId: any;

  constructor(private collab: CollabService) {}

  start() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      this.simulateActivity();
    }, 10000);
  }

  private simulateActivity() {
    let collaborators: any[] = [];
    let text = '';

    this.collab.collaborators$.subscribe(c => (collaborators = c)).unsubscribe();
    this.collab.documentText$.subscribe(t => (text = t)).unsubscribe();

    if (!collaborators.length || !text.length) return;

    const randomCollab =
      collaborators[Math.floor(Math.random() * collaborators.length)];
    const randomPos = Math.floor(Math.random() * text.length);


    this.collab.updateCollaboratorCursor(randomCollab.id, randomPos);

 
    if (Math.random() < 0.4) {
      this.collab.applyRemoteEdit(old => {
        const insert = '·';
        return old.slice(0, randomPos) + insert + old.slice(randomPos);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}