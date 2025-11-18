# CollabDoc

This is a small collaborative document editor built with Angular.
It allows multiple “users” (browser tabs) to type together, add comments, switch roles, and work offline.
Everything runs in the browser using a mocked API and BroadcastChannel for real-time updates.

## Development server

To start a local development server, run:

```bash
npm install
ng serve
```
## Features

*Real-time Editing: Text updates appear across tabs instantly.
*Cursor Presence: Each tab shows a “user” with its own cursor color.
*Roles: Editor can edit + comment, Reviewer can comment, Viewer can only read.
*Inline Comments: Select text → add comment → visible in sidebar.
*Offline Mode: Changes are stored locally and sync back when reconnected.
*Mock API: No backend required.


                  ┌──────────────────────┐
                  │     App Module       │
                  └──────────┬───────────┘
                             │
     ┌───────────────────────┼────────────────────────┐
     │                       │                        │
┌─────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│ Editor       │     │ CommentsSidebar │     │  OfflineToggle       │
│ Component    │     │ Component       │     │ Component            │
└──────┬──────┘     └──────────┬──────┘     └──────────┬───────────┘
       │                        │                       │
       │ (input, cursor, select│                       │ toggle offline
       │ events)               │                       │ mode
       │                        │                       │
       └──────────────┬─────────┴───────────────┬──────┘
                      │                         │
             ┌─────────────────────────┐        │
             │     CollabService       │ <──────┘
             └──────────┬──────────────┘
                        │
                        │ State (BehaviorSubject)
                        │  - document text
                        │  - comments
                        │  - presence
                        │  - offline queue
                        │  - role
                        │
               ┌────────┴─────────┐
               │                  │
    ┌───────────────────┐  ┌──────────────────┐
    │ BroadcastChannel  │  │   MockApiService │
    └───────────────────┘  └──────────────────┘
           │ (sync tabs)         │ (fake save/load)
           └─────────────────────┴───────────────
