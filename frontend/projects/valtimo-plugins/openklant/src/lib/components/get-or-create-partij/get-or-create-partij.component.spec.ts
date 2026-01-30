import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetOrCreatePartijComponent } from './get-or-create-partij.component';
import {EMPTY, of} from "rxjs";
import {GetOrCreatePartijConfig} from "../../models/get-or-create-partij-config";

describe('GetOrCreatePartijComponent', () => {
  let component: GetOrCreatePartijComponent;
  let fixture: ComponentFixture<GetOrCreatePartijComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetOrCreatePartijComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetOrCreatePartijComponent);
    component = fixture.componentInstance;

    component.save$ = EMPTY;
    component.disabled$ = of(false);
    component.pluginId = "test-plugin";

    component.prefillConfiguration$ = of({
      bsn: "",
      voorletters: "",
      voornaam: "",
      voorvoegselAchternaam: "",
      achternaam: "",
    } as GetOrCreatePartijConfig);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
