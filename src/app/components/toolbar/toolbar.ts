import { Component } from '@angular/core';
import { RoleSelector } from '../role-selector/role-selector';
import { OfflineToggle } from '../offline-toggle/offline-toggle';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  imports: [RoleSelector, OfflineToggle, CommonModule],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
})
export class Toolbar {

}
