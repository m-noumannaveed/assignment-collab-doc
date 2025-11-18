import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Role, AppComment, Collaborator, PendingChange } from '../models/collab.models';
import { MockApiService } from './mock-api.service.ts';

@Injectable({ providedIn: 'root' })
export class CollabService {
  private documentTextSubject = new BehaviorSubject<string>(
    'This is a collaborative document. Try selecting text and adding comments!'
  );
  documentText$ = this.documentTextSubject.asObservable();

  private roleSubject = new BehaviorSubject<Role>('editor');
  role$ = this.roleSubject.asObservable();

  private isOfflineSubject = new BehaviorSubject<boolean>(false);
  isOffline$ = this.isOfflineSubject.asObservable();

  private commentsSubject = new BehaviorSubject<AppComment[]>([]);
  comments$ = this.commentsSubject.asObservable();

  private collaboratorsSubject = new BehaviorSubject<Collaborator[]>([
    {
      id: 'c1',
      name: 'Alice',
      color: '#ff6b6b',
      avatarInitials: 'A',
      cursorIndex: null,
      isActive: true,
    },
    {
      id: 'c2',
      name: 'Bob',
      color: '#6c5ce7',
      avatarInitials: 'B',
      cursorIndex: null,
      isActive: true,
    },
    {
      id: 'c3',
      name: 'Charlie',
      color: '#00b894',
      avatarInitials: 'C',
      cursorIndex: null,
      isActive: true,
    },
  ]);
  collaborators$ = this.collaboratorsSubject.asObservable();

  private pendingChangesSubject = new BehaviorSubject<PendingChange[]>([]);
  pendingChanges$ = this.pendingChangesSubject.asObservable();

  private bc = new BroadcastChannel('collab-doc');
  private queue: any[] = [];

  constructor(private mockApi: MockApiService) {
    this.listenToBroadcast();
  }

  private broadcast(type: string, payload: any) {
    this.bc.postMessage({ type, payload });
  }

  private listenToBroadcast() {
this.bc.onmessage = (event) => {
  const isOffline = this.isOfflineSubject.value;

  if (isOffline) {
    console.warn("Offline mode: ignoring incoming broadcast message", event.data);
    return;
  }

  const { type, payload } = event.data;

  switch (type) {

    case 'edit':
      this.documentTextSubject.next(payload.newText);
      break;

    case 'cursor':
      this.updateCollaboratorCursor(payload.id, payload.cursorIndex);
      break;

    case 'comment':
      this.handleIncomingComment(payload);
      break;

    default:
      console.warn("Unknown broadcast type", type);
  }
};

}

private handleIncomingComment(comment: AppComment) {
  const updated = [...this.commentsSubject.value, comment];
  this.commentsSubject.next(updated);
}


  setRole(role: Role) {
    this.roleSubject.next(role);
  }

  setOffline(isOffline: boolean) {
    this.isOfflineSubject.next(isOffline);

    if (!isOffline) {
      this.syncPendingChanges();
    }
  }

  applyLocalEdit(newText: string) {
  const offline = this.isOfflineSubject.value;

  const change: PendingChange = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    type: 'edit',
    payload: { newText }
  };

  if (offline) {

    this.documentTextSubject.next(newText);


    this.queueChange(change);

    return; 
  }


  this.documentTextSubject.next(newText);


  this.mockApi.saveDocument(newText).subscribe();


  this.broadcast('edit', { newText });
  console.log("📤 BROADCAST SENT:", change.payload);
}



  applyRemoteEdit(transform: (oldText: string) => string) {
    const current = this.documentTextSubject.value;
    const updated = transform(current);
    this.documentTextSubject.next(updated);
  }

  addComment(comment: Omit<AppComment, 'id' | 'createdAt'>) {
    const fullComment: AppComment = {
      ...comment,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    const updated = [...this.commentsSubject.value, fullComment];
    this.commentsSubject.next(updated);

    this.broadcast('comment', fullComment);

    const offline = this.isOfflineSubject.value;
    const change: PendingChange = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type: 'comment-add',
      payload: fullComment,
    };

    if (offline) {
      this.queueChange(change);
    } else {
      this.mockApi.addComment(fullComment).subscribe();
    }
  }

  updateCollaboratorCursor(id: string, cursorIndex: number | null) {
  const updated = this.collaboratorsSubject.value.map(c =>
    c.id === id ? { ...c, cursorIndex } : c
  );
  this.collaboratorsSubject.next(updated);

  this.broadcast('cursor', { id, cursorIndex });
}

  private queueChange(change: PendingChange) {
    const updated = [...this.pendingChangesSubject.value, change];
    this.pendingChangesSubject.next(updated);
  }

  private syncPendingChanges() {
    const pending = this.pendingChangesSubject.value;
    if (!pending.length) return;

    this.mockApi.syncChanges(pending).subscribe(() => {
      this.pendingChangesSubject.next([]);
    });
  }

  setOfflineMode(v: boolean) {
    console.log("TOGGLE CHANGED: offline =", v);
  this.isOfflineSubject.next(v);

  if (!v) {
    console.log("↪ Going online → Calling flushPendingChanges()");
    this.flushPendingChanges();
  }
}

flushPendingChanges() {
  const queue = this.pendingChangesSubject.value;

  console.log("FLUSH CALLED — pending changes:", queue);

  if (queue.length === 0) {
    console.warn("❗ FLUSH STOPPED — Queue is EMPTY");
    return;
  }

  for (const change of queue) {
    switch (change.type) {

      case 'edit':
        this.documentTextSubject.next(change.payload.newText);
        this.broadcast('edit', change.payload);
        this.mockApi.saveDocument(change.payload.newText).subscribe();
        break;

      case 'comment-add':
        const updated = [...this.commentsSubject.value, change.payload];
        this.commentsSubject.next(updated);
        this.broadcast('comment', change.payload);
        this.mockApi.addComment(change.payload).subscribe();
        break;

      case 'cursor':
        this.broadcast('cursor', change.payload);
        break;
    }
  }

  this.pendingChangesSubject.next([]);
}


}
