import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetOrCreatePartijComponent } from './get-or-create-partij.component';

describe('GetOrCreatePartijComponent', () => {
  let component: GetOrCreatePartijComponent;
  let fixture: ComponentFixture<GetOrCreatePartijComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetOrCreatePartijComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetOrCreatePartijComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
