import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSuccessComponent } from './user-success.component';

describe('UserSuccessComponent', () => {
  let component: UserSuccessComponent;
  let fixture: ComponentFixture<UserSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
