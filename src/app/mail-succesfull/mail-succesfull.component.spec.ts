import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailSuccesfullComponent } from './mail-succesfull.component';

describe('MailSuccesfullComponent', () => {
  let component: MailSuccesfullComponent;
  let fixture: ComponentFixture<MailSuccesfullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailSuccesfullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailSuccesfullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
