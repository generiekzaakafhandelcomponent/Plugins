import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenKlantPostKlantcontactComponent } from './open-klant-post-klantcontact.component';

describe('OpenKlantPostKlantcontactComponent', () => {
  let component: OpenKlantPostKlantcontactComponent;
  let fixture: ComponentFixture<OpenKlantPostKlantcontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenKlantPostKlantcontactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenKlantPostKlantcontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
