import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnkerComponent } from './anker.component';

describe('AnkerComponent', () => {
  let component: AnkerComponent;
  let fixture: ComponentFixture<AnkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
