import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { ContactHistoryTabComponent } from "./contact-history-tab.component";
import { ProcessService } from "@valtimo/process";
import { NGXLogger } from "ngx-logger";
import { ActivatedRoute } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs";
import { PollingService } from "../../services/polling.service";
import { mapDtoToModel } from "../../models/klantcontact.model";
import { ContactHistoryService } from "../../services/contact-history.service";
import { ProcessPollingService } from "../../services/process-polling.service";
import { mockKlantcontactDTO } from "../../testing/mocks/mockKlantcontactDto";
import { mockProcessInstance } from "../../testing/mocks/mockProcessInstance"
import { mockProcessInstanceStartResponse } from "../../testing/mocks/mockProcessInstanceStartResponse";

describe("ContactHistoryTabComponent", () => {
  let component: ContactHistoryTabComponent;
  let fixture: ComponentFixture<ContactHistoryTabComponent>;

  function setupTestBed(
    routeParamMap: Map<string, string> = new Map([
      ["documentId", "mock-document-id"],
    ])
  ) {
    TestBed.configureTestingModule({
      imports: [ContactHistoryTabComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: routeParamMap } },
        },
        {
          provide: ProcessService,
          useValue: {
            startProcesInstance: jasmine
              .createSpy("startProcesInstance")
              .and.returnValue(of({ id: "fake", ended: true })),
            getProcessInstance: jasmine.createSpy("getProcessInstance"),
          },
        },
        {
          provide: ContactHistoryService,
          useValue: {
            fetchFromDocument: jasmine
              .createSpy("fetchFromDocument")
              .and.returnValue(of([mapDtoToModel(mockKlantcontactDTO)])),
          },
        },
        ProcessPollingService,
        {
          provide: PollingService,
          useValue: {
            createExponentialPollingTicks: jasmine
              .createSpy()
              .and.returnValue(of(0, 1, 2)),
          },
        },
        {
          provide: NGXLogger,
          useValue: {
            debug: jasmine.createSpy("debug"),
            info: jasmine.createSpy("info"),
            warn: jasmine.createSpy("warn"),
            error: jasmine.createSpy("error"),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactHistoryTabComponent);
    component = fixture.componentInstance;

    return { fixture, component };
  }

  it("should be created as an instance of ContactHistoryTabComponent", () => {
    const { component } = setupTestBed();

    fixture.detectChanges();

    expect(fixture.componentInstance).toBeInstanceOf(
      ContactHistoryTabComponent
    );
  });

  it("should load the document and map the contact history", () => {
    const { component } = setupTestBed();
    const loadContactHistorySpy = TestBed.inject(ContactHistoryService)
        .fetchFromDocument as jasmine.Spy;

    fixture.detectChanges();

    expect(loadContactHistorySpy)
      .withContext("getDocument was called with unexepected arguments")
      .toHaveBeenCalledWith("mock-document-id");
    expect(component.contactHistory.length).toBe(1);
    expect(component.isLoading).toBeFalse();
    expect(component.isFailed).toBeFalse();
    expect(component.contactHistory)
      .withContext("contactHistory was different than expected: ")
      .toEqual([mapDtoToModel(mockKlantcontactDTO)]);
  });

  it("should do nothing and go into isFailed state if no documentId is available in the route snapshot paramMap", () => {
    const { component } = setupTestBed(new Map()); // pass empty map as routeParamMap -> no documentId
    const loadContactHistorySpy = TestBed.inject(ContactHistoryService)
      .fetchFromDocument as jasmine.Spy;
    const startProcessInstanceSpy = TestBed.inject(ProcessService)
      .startProcesInstance as jasmine.Spy;

    fixture.detectChanges();

    expect(loadContactHistorySpy).not.toHaveBeenCalled();
    expect(startProcessInstanceSpy).not.toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.isFailed).toBeTrue();
    expect(component.contactHistory).toEqual([]);
  });

  it(`should retrieve the document's contactHistory twice (at init and after finishing the called process)`, fakeAsync(() => {
    const { component } = setupTestBed();
    const loadContactHistorySpy = TestBed.inject(ContactHistoryService)
      .fetchFromDocument as jasmine.Spy;
    const startProcessInstanceSpy = TestBed.inject(ProcessService)
      .startProcesInstance as jasmine.Spy;
    // with `ended: true`, simulating that the document has been now populated with fresh contactHistory data
    startProcessInstanceSpy.and.returnValue(
      of({ ...mockProcessInstanceStartResponse, ended: true })
    );

    fixture.detectChanges();
    tick();

    expect(loadContactHistorySpy).toHaveBeenCalledTimes(2);
    expect(component.isLoading).toBeFalse();
    expect(component.isFailed).toBeFalse();
  }));

  it("should stop polling as soon as the processService.getProcessInstance response has the property .endtime", fakeAsync(() => {
    const { component } = setupTestBed();
    const pollingTicksSpy = TestBed.inject(PollingService)
      .createExponentialPollingTicks as jasmine.Spy;
    const startProcessInstanceSpy = TestBed.inject(ProcessService)
      .startProcesInstance as jasmine.Spy;
    const getProcessInstanceSpy = TestBed.inject(ProcessService)
      .getProcessInstance as jasmine.Spy;
    startProcessInstanceSpy.and.returnValue(
      of(mockProcessInstanceStartResponse)
    );
    pollingTicksSpy.and.returnValue(of(0, 1, 2));
    getProcessInstanceSpy.and.returnValues(
      of({ ...mockProcessInstance, endTime: "" }),
      of({ ...mockProcessInstance, endTime: "" }),
      of({ ...mockProcessInstance, endTime: new Date().toISOString() })
    );

    fixture.detectChanges();
    tick();

    expect(getProcessInstanceSpy).toHaveBeenCalledTimes(3);
    expect(component.isLoading).toBeFalse();
    expect(component.isFailed).toBeFalse();
  }));

  it("should start polling if the response of the call to startProcesInstance has the property ended: false", fakeAsync(() => {
    const { component } = setupTestBed();
    const startProcessInstanceSpy = TestBed.inject(ProcessService)
      .startProcesInstance as jasmine.Spy;
    const processPollingService = TestBed.inject(ProcessPollingService);
    const pollUntilStoppedSpy = spyOn(
      processPollingService,
      "pollUntilStopped"
    ).and.returnValue(
      of({ ...mockProcessInstance, endTime: new Date().toISOString() }) // first poll completes stream since it has an endTime
    );
    startProcessInstanceSpy.and.returnValue(
      of({ ...mockProcessInstanceStartResponse, ended: false })
    );

    fixture.detectChanges();
    tick();

    expect(startProcessInstanceSpy).toHaveBeenCalledTimes(1);
    expect(pollUntilStoppedSpy).toHaveBeenCalledTimes(1);
    expect(component.isLoading).toBeFalse();
    expect(component.isFailed).toBeFalse();
  }));
});
