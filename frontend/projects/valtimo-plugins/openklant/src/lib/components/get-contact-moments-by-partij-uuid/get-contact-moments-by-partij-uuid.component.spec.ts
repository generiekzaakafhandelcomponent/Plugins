import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';

import { GetContactMomentsByPartijUuidComponent } from './get-contact-moments-by-partij-uuid.component';
import { GetContactMomentsByPartijUuidConfig } from '../../models/get-contact-moments-by-partij-uuid-config';

describe('OpenKlantGetContactMomentsByPartijUuidComponent', () => {
  let component: GetContactMomentsByPartijUuidComponent;
  let fixture: ComponentFixture<GetContactMomentsByPartijUuidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetContactMomentsByPartijUuidComponent]
    })
      .overrideTemplate(GetContactMomentsByPartijUuidComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GetContactMomentsByPartijUuidComponent);
    component = fixture.componentInstance;

    component.save$ = EMPTY;
    component.disabled$ = of(false);
    component.pluginId = 'test-plugin';

    const minimalPrefill: GetContactMomentsByPartijUuidConfig = {
      resultPvName: '',
      partijUuid: ''
    } as GetContactMomentsByPartijUuidConfig;
    component.prefillConfiguration$ = of(minimalPrefill);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component instanceof GetContactMomentsByPartijUuidComponent).toBeTrue();
  });
});
