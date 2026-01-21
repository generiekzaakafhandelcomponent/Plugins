import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EMPTY, of } from "rxjs";

import { GetContactMomentsByCaseUuidComponent } from "./open-klant-get-contact-moments-by-case-uuid.component";
import { GetContactMomentsByCaseUuidConfig } from "../../models/get-contact-moments-by-case-uuid-config";

describe("OpenKlantGetContactMomentsByCaseUuidComponent", () => {
  let component: GetContactMomentsByCaseUuidComponent;
  let fixture: ComponentFixture<GetContactMomentsByCaseUuidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetContactMomentsByCaseUuidComponent],
    })
      .overrideTemplate(GetContactMomentsByCaseUuidComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(GetContactMomentsByCaseUuidComponent);
    component = fixture.componentInstance;

    component.save$ = EMPTY;
    component.disabled$ = of(false);
    component.pluginId = "test-plugin";

    const minimalPrefill: GetContactMomentsByCaseUuidConfig = {
      resultPvName: "",
      caseUuid: "",
    } as GetContactMomentsByCaseUuidConfig;
    component.prefillConfiguration$ = of(minimalPrefill);

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
