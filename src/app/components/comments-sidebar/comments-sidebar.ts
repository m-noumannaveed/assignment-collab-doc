import { Component } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { CollabService } from '../../core/services/collab.service.ts';
import { CommonModule } from '@angular/common';
import { AppComment } from '../../core/models/collab.models.js';

@Component({
  selector: 'app-comments-sidebar',
  imports: [CommonModule],
  templateUrl: './comments-sidebar.html',
  styleUrl: './comments-sidebar.scss',
})
export class CommentsSidebar {
 comments$: Observable<AppComment[]>;

  constructor(private collab: CollabService) {
    this.comments$ = combineLatest([
      this.collab.comments$,
      this.collab.documentText$,
    ]).pipe(
      map(([comments, text]) =>
        comments.map<AppComment>(c => ({
          ...c,
          excerpt: c.excerpt,
        }))
      )
    );
  }
}