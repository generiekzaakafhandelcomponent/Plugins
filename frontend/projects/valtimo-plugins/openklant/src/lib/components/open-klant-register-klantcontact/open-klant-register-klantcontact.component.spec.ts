import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RegisterKlantcontactComponent } from "./open-klant-register-klantcontact.component";
import { RegisterKlantcontactConfig } from "../../models/register-klantcontact-config";
import { BehaviorSubject, of, Subject } from "rxjs";
import { EventEmitter, NO_ERRORS_SCHEMA } from "@angular/core";
import {
  TranslateModule,
  TranslateLoader,
  TranslateFakeLoader,
} from "@ngx-translate/core";
import { PluginService } from "@valtimo/plugin";
import { InputComponent } from "@valtimo/components";
import { By } from "@angular/platform-browser";

const pluginServiceMock: Partial<PluginService> = {} as any;

describe("RegisterKlantcontactComponent", () => {
  let component: RegisterKlantcontactComponent;
  let fixture: ComponentFixture<RegisterKlantcontactComponent>;

  let save$: Subject<void>;
  let disabled$: BehaviorSubject<boolean>;

  const inputByName = (name: string): InputComponent | undefined =>
    fixture.debugElement
      .queryAll(By.directive(InputComponent))
      .map(reference => reference.componentInstance as InputComponent)
      .find(input => input.name === name);

  const setInput = (name: string, value: unknown): void => {
    const input = inputByName(name);
    expect(input)
      .withContext(`the form should contain a v-input named '${name}'`)
      .toBeDefined();
    input.onValueChange(value);
  };

  const validFormValue: RegisterKlantcontactConfig = {
    hasBetrokkene: true,
    referentienummer: "",
    kanaal: "email",
    onderwerp: "Subject",
    inhoud: "Content",
    reactie: "Reactie",
    indicatieContactGelukt: "true",
    vertrouwelijk: "true",
    taal: "nld",
    plaatsgevondenOp: new Date().toISOString(),
    metadata: "",
    partijUuid: "uuid-123",
    voorletters: "J.D.",
    voornaam: "John",
    voorvoegselAchternaam: "van",
    achternaam: "Doe",
  };

  const invalidFormValueMissingField: RegisterKlantcontactConfig = {
    hasBetrokkene: true,
    referentienummer: "",
    kanaal: "",
    onderwerp: "Subject",
    inhoud: "Content",
    reactie: "Reactie",
    indicatieContactGelukt: "true",
    vertrouwelijk: "true",
    taal: "nld",
    plaatsgevondenOp: new Date().toISOString(),
    metadata: "",
    partijUuid: "uuid-123",
    voorletters: "J.D.",
    voornaam: "John",
    voorvoegselAchternaam: "van",
    achternaam: "Doe",
  };

  beforeEach(async () => {
    save$ = new Subject<void>();
    disabled$ = new BehaviorSubject<boolean>(false);

    await TestBed.configureTestingModule({
      imports: [
        RegisterKlantcontactComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
      providers: [{ provide: PluginService, useValue: pluginServiceMock }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterKlantcontactComponent);
    component = fixture.componentInstance;

    component.save$ = save$.asObservable();
    component.disabled$ = disabled$.asObservable();
    component.pluginId = "plugin-123";

    component.valid = new EventEmitter<boolean>();
    component.configuration = new EventEmitter<RegisterKlantcontactConfig>();

    spyOn(component.valid, "emit");
    spyOn(component.configuration, "emit");

    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it("should create", () => {
    expect(component instanceof RegisterKlantcontactComponent).toBeTrue();
  });

  describe("lifecycle", () => {
    it("should open save subscription on init", () => {
      expect((component as any).saveSubscription).toBeDefined();
    });

    it("should unsubscribe on destroy", () => {
      const sub = (component as any).saveSubscription;
      spyOn(sub, "unsubscribe").and.callThrough();

      component.ngOnDestroy();
      expect(sub.unsubscribe).toHaveBeenCalled();
    });
  });

  describe("validation", () => {
    it("should mark valid when all required fields are present", () => {
      component.formValueChange(validFormValue);
      expect(component.valid.emit).toHaveBeenCalledWith(true);
    });

    it("should mark valid when hasBetrokkene is set to false and all required fields are present", () => {
      const validFormValueWithConfidentialSetOnFalse: RegisterKlantcontactConfig =
        {
          hasBetrokkene: false,
          referentienummer: "123",
          kanaal: "email",
          onderwerp: "Subject",
          inhoud: "Content",
          reactie: "Reactie",
          indicatieContactGelukt: "true",
          vertrouwelijk: "false",
          taal: "nld",
          plaatsgevondenOp: new Date().toISOString(),
          metadata: "",
          partijUuid: undefined,
          voorletters: undefined,
          voornaam: undefined,
          voorvoegselAchternaam: undefined,
          achternaam: undefined,
        };

      component.formValueChange(validFormValueWithConfidentialSetOnFalse);
      expect(component.valid.emit).toHaveBeenCalledWith(true);
    });

    it("should mark invalid when any required field is missing or falsy", () => {
      component.formValueChange(invalidFormValueMissingField);
      expect(component.valid.emit).toHaveBeenCalledWith(false);
    });

    it("should emit multiple valid states as form changes", () => {
      component.formValueChange(invalidFormValueMissingField);
      component.formValueChange(validFormValue);

      expect(component.valid.emit).toHaveBeenCalledWith(false);
      expect(component.valid.emit).toHaveBeenCalledWith(true);
      expect((component as any).valid$.getValue()).toBeTrue();
    });
  });

  describe("save behavior", () => {
    it("should emit configuration when valid on save", () => {
      component.formValueChange(validFormValue);

      save$.next();

      expect(component.configuration.emit).toHaveBeenCalledTimes(1);
      expect(component.configuration.emit).toHaveBeenCalledWith(validFormValue);
    });

    it("should NOT emit configuration when invalid on save", () => {
      component.formValueChange(invalidFormValueMissingField);

      save$.next();

      expect(component.configuration.emit).not.toHaveBeenCalled();
    });

    it("should only take the latest snapshot at the moment of save", () => {
      component.formValueChange(invalidFormValueMissingField);

      component.formValueChange(validFormValue);

      save$.next();

      expect(component.configuration.emit).toHaveBeenCalledTimes(1);
      expect(component.configuration.emit).toHaveBeenCalledWith(validFormValue);
    });
  });

  describe("formValueChange", () => {
    it("should update internal formValue$ state", () => {
      component.formValueChange(validFormValue);
      const current = (component as any).formValue$.getValue();
      expect(current).toEqual(validFormValue);
    });

    it("should compute and emit validity when formValue changes", () => {
      component.formValueChange(invalidFormValueMissingField);
      expect(component.valid.emit).toHaveBeenCalledWith(false);

      component.formValueChange(validFormValue);
      expect(component.valid.emit).toHaveBeenCalledWith(true);
    });
  });

  // Regression coverage for Github Issue #14
  describe("hasBetrokkene", () => {
    const fillRequiredKlantcontactFields = (): void => {
      setInput("kanaal", '"E-mail"');
      setInput("onderwerp", '"Herinnering: openstaande taak"');
      setInput("vertrouwelijk", "false");
      setInput("taal", "nld");
      setInput("plaatsgevondenOp", "pv:datumTijd");
    };

    it("should render hasBetrokkene as a form control so v-form collects it", () => {
      expect(inputByName("hasBetrokkene")).toBeDefined();
    });

    it("should hide the betrokkene fields until hasBetrokkene is enabled", () => {
      expect(inputByName("partijUuid")).toBeUndefined();

      setInput("hasBetrokkene", true);
      fixture.detectChanges();

      expect(inputByName("partijUuid")).toBeDefined();
    });

    it("should persist hasBetrokkene as true along with the betrokkene fields", () => {
      fillRequiredKlantcontactFields();
      setInput("hasBetrokkene", true);
      fixture.detectChanges();

      setInput("partijUuid", "pv:partijUuid");
      setInput("voorletters", '"P"');
      setInput("voornaam", '"Pietje"');
      setInput("voorvoegselAchternaam", '""');
      setInput("achternaam", '"Puk"');
      fixture.detectChanges();

      save$.next();

      expect(component.configuration.emit).toHaveBeenCalledWith(
        jasmine.objectContaining({
          hasBetrokkene: true,
          partijUuid: "pv:partijUuid",
          voornaam: '"Pietje"',
          achternaam: '"Puk"',
        }),
      );
    });

    it("should persist hasBetrokkene as false for an anonymous klantcontact", () => {
      fillRequiredKlantcontactFields();
      setInput("hasBetrokkene", false);
      fixture.detectChanges();

      save$.next();

      expect(component.configuration.emit).toHaveBeenCalledWith(
        jasmine.objectContaining({hasBetrokkene: false}),
      );
    });
  });

  describe("prefill of a process link without a persisted hasBetrokkene", () => {
    const legacyPrefill = (
      partijUuid: string | undefined,
    ): Partial<RegisterKlantcontactConfig> => ({
      referentienummer: "",
      kanaal: "email",
      onderwerp: "Subject",
      inhoud: "Content",
      reactie: "Reactie",
      indicatieContactGelukt: "true",
      vertrouwelijk: "true",
      taal: "nld",
      plaatsgevondenOp: "2026-08-31T12:00:00Z",
      metadata: "",
      partijUuid,
      voorletters: "J.D.",
      voornaam: "John",
      voorvoegselAchternaam: "van",
      achternaam: "Doe",
    });

    const createWithPrefill = (
      prefill: Partial<RegisterKlantcontactConfig>,
    ): void => {
      fixture = TestBed.createComponent(RegisterKlantcontactComponent);
      component = fixture.componentInstance;

      component.save$ = save$.asObservable();
      component.disabled$ = disabled$.asObservable();
      component.pluginId = "plugin-123";
      component.prefillConfiguration$ = of(
        prefill as RegisterKlantcontactConfig,
      );

      component.valid = new EventEmitter<boolean>();
      component.configuration = new EventEmitter<RegisterKlantcontactConfig>();

      spyOn(component.valid, "emit");
      spyOn(component.configuration, "emit");

      fixture.detectChanges();
    };

    it("should derive hasBetrokkene from the partijUuid so the betrokkene fields stay visible", () => {
      createWithPrefill(legacyPrefill("uuid-123"));

      expect(inputByName("hasBetrokkene").inputValue$.getValue()).toBeTrue();
      expect(inputByName("partijUuid")).toBeDefined();
    });

    it("should not drop the configured betrokkene when such a process link is re-saved", () => {
      createWithPrefill(legacyPrefill("uuid-123"));

      save$.next();

      expect(component.configuration.emit).toHaveBeenCalledWith(
        jasmine.objectContaining({
          hasBetrokkene: true,
          partijUuid: "uuid-123",
          voornaam: "John",
          achternaam: "Doe",
        }),
      );
    });

    it("should leave hasBetrokkene unchecked when no partijUuid was configured", () => {
      createWithPrefill(legacyPrefill(undefined));

      expect(inputByName("hasBetrokkene").inputValue$.getValue()).toBeFalse();
      expect(inputByName("partijUuid")).toBeUndefined();
    });

    it("should honour an explicitly persisted hasBetrokkene of false over a leftover partijUuid", () => {
      createWithPrefill({...legacyPrefill("uuid-123"), hasBetrokkene: false});

      expect(inputByName("hasBetrokkene").inputValue$.getValue()).toBeFalse();
      expect(inputByName("partijUuid")).toBeUndefined();
    });
  });
});
