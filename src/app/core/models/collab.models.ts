export type Role = 'editor' | 'reviewer' | 'viewer';

export interface AppComment {
  id: string;
  author: string;
  text: string;
  createdAt: Date;
  excerpt: string;
  start: number;
  end: number;
}

export interface Collaborator {
  id: string;
  name: string;
  color: string;
  avatarInitials: string;
  cursorIndex: number | null;
  isActive: boolean;
}

export interface PendingChange {
  id: string;
  timestamp: number;
  type: 'edit' | 'comment-add' | 'cursor';
  payload: any;
}
