import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SetDefaultDigitaalAdresComponent} from './set-default-digitaal-adres.component';
import {GetOrCreatePartijComponent} from "../get-or-create-partij/get-or-create-partij.component";
import {EMPTY, of} from "rxjs";
import {GetOrCreatePartijConfig} from "../../models/get-or-create-partij-config";
import {SetDefaultDigitaalAdresConfig} from "../../models/set-default-digitaal-adres-config";

describe('SetDefaultDigitaalAdresComponent', () => {
  let component: SetDefaultDigitaalAdresComponent;
  let fixture: ComponentFixture<SetDefaultDigitaalAdresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetDefaultDigitaalAdresComponent]
    })
      .overrideTemplate(SetDefaultDigitaalAdresComponent, "")
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetDefaultDigitaalAdresComponent);
    component = fixture.componentInstance;

    component.save$ = EMPTY;
    component.disabled$ = of(false);
    component.pluginId = "test-plugin";

    component.prefillConfiguration$ = of({
      resultPvName: "",
      partijUuid: "",
      adres: "",
      soortDigitaalAdres: "",
      verificatieDatum: "",
    } as SetDefaultDigitaalAdresConfig);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
