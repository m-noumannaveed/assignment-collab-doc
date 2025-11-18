import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PresenceService } from './core/services/presence.service.ts';
import { Toolbar } from './components/toolbar/toolbar.js';
import { OfflineBanner } from './components/offline-banner/offline-banner.js';
import { PresenceBar } from './components/presence-bar/presence-bar.js';
import { Editor } from './components/editor/editor.js';
import { CommentsSidebar } from './components/comments-sidebar/comments-sidebar.js';
import { RoleSelector } from './components/role-selector/role-selector.js';
import { OfflineToggle } from './components/offline-toggle/offline-toggle.js';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule,
    Toolbar,
    OfflineBanner,
    PresenceBar,
    Editor,
    CommentsSidebar,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('collab-doc');
  constructor(private presence: PresenceService) {}

  ngOnInit(): void {
    this.presence.start();
    console.log('I m here'); 
    
  }
}
