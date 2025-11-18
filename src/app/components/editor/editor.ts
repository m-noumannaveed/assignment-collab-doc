import { Component, ElementRef, ViewChild } from '@angular/core';
import { CollabService } from '../../core/services/collab.service.ts';
import { combineLatest, map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Collaborator, Role } from '../../core/models/collab.models.js';

interface EditorVM {
  text: string;
  role: Role;
}
@Component({
  selector: 'app-editor',
  imports: [CommonModule],
  templateUrl: './editor.html',
  styleUrl: './editor.scss',
})
export class Editor {
  vm$: Observable<EditorVM>;

  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('editor') editorEl!: ElementRef;
  cursorPositions: Record<string, { left: number; top: number }> = {};
  

  private selectionStart: number | null = null;
  private selectionEnd: number | null = null;
  collaborators$!: Observable<Collaborator[]>;
  selectedText: string = '';

  constructor(private collab: CollabService) {
    this.vm$ = combineLatest([this.collab.documentText$, this.collab.role$]).pipe(
      map(([text, role]) => ({ text, role }))
    );
    this.collaborators$ = this.collab.collaborators$;
  }
 onInput(event: Event, role: Role) {
  if (role !== 'editor') return;

  const newText = (event.target as HTMLElement)?.innerText ?? '';
  this.collab.applyLocalEdit(newText);
}

  onSelect() {
    const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    this.selectedText = '';
    return;
  }

  this.selectedText = selection.toString();
}


  canAddComment(role: Role): boolean {
    
    return role === 'editor' || role === 'reviewer';
  }

  addComment(role: Role) {
    if (!this.canAddComment(role)) return;

    const text = prompt('Enter comment:');
    if (!text) return;

    this.collab.addComment({
      author: role === 'editor' ? 'You (Editor)' : 'You (Reviewer)',
      text,
      excerpt: this.selectedText,
      start: this.selectionStart!,
      end: this.selectionEnd!,
    });
  }

  ngAfterViewInit() {
  this.collab.collaborators$.subscribe(cList => {
    const editor = this.editorEl.nativeElement;
    const range = document.createRange();

    cList.forEach(c => {
      if (c.cursorIndex == null) return;

      try {
        const node = editor.firstChild || editor;
        range.setStart(node, c.cursorIndex);
        range.collapse(true);

        const rect = range.getBoundingClientRect();
        const parentRect = editor.getBoundingClientRect();

        this.cursorPositions[c.id] = {
          left: rect.left - parentRect.left,
          top: rect.top - parentRect.top
        };
      } catch (_) {}
    });
  });
}
}