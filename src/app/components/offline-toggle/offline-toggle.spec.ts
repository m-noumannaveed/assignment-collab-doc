import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineToggle } from './offline-toggle';

describe('OfflineToggle', () => {
  let component: OfflineToggle;
  let fixture: ComponentFixture<OfflineToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfflineToggle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfflineToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
