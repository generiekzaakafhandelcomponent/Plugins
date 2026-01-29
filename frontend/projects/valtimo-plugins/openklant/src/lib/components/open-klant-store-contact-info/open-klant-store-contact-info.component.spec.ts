import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EMPTY, of } from "rxjs";

import { StoreContactInfoComponent } from "./open-klant-store-contact-info.component";
import { StoreContactInfoConfig } from "../../models/store-contact-info-config";

describe("StoreContactInfoComponent", () => {
  let component: StoreContactInfoComponent;
  let fixture: ComponentFixture<StoreContactInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreContactInfoComponent],
    })
      .overrideTemplate(StoreContactInfoComponent, "")
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreContactInfoComponent);
    component = fixture.componentInstance;

    component.save$ = EMPTY;
    component.disabled$ = of(false);
    component.pluginId = "test-plugin";

    component.prefillConfiguration$ = of({
      bsn: "",
      firstName: "",
      inFix: "",
      lastName: "",
      emailAddress: "",
      caseUuid: "",
    } as StoreContactInfoConfig);

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
