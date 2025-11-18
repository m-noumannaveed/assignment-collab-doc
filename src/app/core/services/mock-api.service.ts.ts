import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AppComment, PendingChange } from '../models/collab.models';

@Injectable({
  providedIn: 'root',
})
export class MockApiService {
  saveDocument(newText: string): Observable<void> {
    console.log('saveDocument', newText);
    return of(void 0).pipe(delay(300));
  }

  saveComment(comment: AppComment) {
    console.log('Saving comment →', comment);
    return of(true).pipe(delay(200));
  }

  addComment(comment: AppComment): Observable<void> {
    console.log('addComment', comment);
    return of(void 0).pipe(delay(200));
  }

  syncChanges(changes: PendingChange[]): Observable<void> {
    console.log('syncChanges', changes);
    return of(void 0).pipe(delay(500));
  }
}
