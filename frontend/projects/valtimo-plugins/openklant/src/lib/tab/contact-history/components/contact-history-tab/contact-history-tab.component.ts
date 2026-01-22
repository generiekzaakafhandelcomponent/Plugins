import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonModule, NgClass, NgForOf, NgIf } from "@angular/common";
import {
  finalize,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from "rxjs";
import { CarbonListModule, TimelineModule } from "@valtimo/components";
import { ProcessInstance, ProcessService } from "@valtimo/process";
import { LoadingModule } from "carbon-components-angular";
import { NGXLogger } from "ngx-logger";
import {
  ContactOutcome,
  Klantcontact as KlantContact,
} from "../models/klantcontact.model";
import { ProcessPollingService } from "../../services/process-polling.service";
import { ContactHistoryService } from "../../services/contact-history.service";

@Component({
  selector: "generieke-contactgeschiedenis",
  standalone: true,
  templateUrl: "./contact-history-tab.component.html",
  imports: [
    NgForOf,
    TimelineModule,
    NgClass,
    NgIf,
    CarbonListModule,
    LoadingModule,
    CommonModule,
  ],
  styleUrl: "./contact-history-tab.component.scss",
})
export class ContactHistoryTabComponent implements OnInit {
  private PROCESS_KEY: string = "contactgeschiedenis-ophalen";
  private EXP_POLLING_START_INTERVAL_IN_MS = 1000;
  private MAX_POLLING_TIME_IN_MS = 20000;

  private destroy$ = new Subject<void>();
  private retrievedFreshContactHistory$ = new Subject<void>();

  private documentId = "";

  private _isLoading = true;
  get isLoading() {
    return this._isLoading;
  }
  set isLoading(isLoading) {
    this._isLoading = isLoading;
  }

  private _isFailed = false;
  get isFailed() {
    return this._isFailed;
  }
  set isFailed(isFailed) {
    this._isFailed = isFailed;
  }

  private _contactHistory: KlantContact[] | null = null;
  get contactHistory() {
    return this._contactHistory;
  }
  set contactHistory(contactHistory) {
    this._contactHistory = contactHistory;
  }

  // Expose enum for use in template
  ContactOutcome = ContactOutcome;

  constructor(
    private route: ActivatedRoute,
    private processService: ProcessService,
    private processPollingService: ProcessPollingService,
    private contactHistoryService: ContactHistoryService,
    private readonly logger: NGXLogger
  ) {}

  ngOnInit() {
    const snapshot = this.route.snapshot.paramMap;
    this.documentId = snapshot.get("documentId") ?? "";

    if (!this.documentId) {
      this.isLoading = false;
      this.isFailed = true;
      return;
    }

    this.contactHistoryService
      .load(this.documentId)
      .pipe(
        takeUntil(this.destroy$),
        takeUntil(this.retrievedFreshContactHistory$)
      )
      .subscribe((contacts) => (this.contactHistory = contacts));

    // Start fetching fresh contactHistory
    this.processService
      .startProcesInstance(this.PROCESS_KEY, this.documentId, new Map())
      ?.pipe(
        switchMap((process) => {
          return process.ended
            ? of(null)
            : this.pollUntilStoppedWrapper(process.id);
        }),
        switchMap(() => this.contactHistoryService.load(this.documentId)),
        tap(() => this.retrievedFreshContactHistory$.next()),
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (contacts) => {
          this.contactHistory = contacts;
        },
        error: (error) => {
          this.logger.error(
            `An error occurred while retrieving customer contacts: ${error}`
          );
          this.isFailed = true;
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    this.retrievedFreshContactHistory$.next();
    this.retrievedFreshContactHistory$.complete();
  }


  private pollUntilStoppedWrapper(
    processId: string
  ): Observable<ProcessInstance> {
    return this.processPollingService.pollUntilStopped(
      processId,
      this.EXP_POLLING_START_INTERVAL_IN_MS,
      this.MAX_POLLING_TIME_IN_MS,
      this.destroy$
    );
  }

  getOutcomeLabel(outcome: ContactOutcome): string {
    switch (outcome) {
      case ContactOutcome.SUCCESS:
        return "Succesvol";
      case ContactOutcome.FAILURE:
        return "Mislukt";
      case ContactOutcome.NOT_APPLICABLE:
        return "Status niet van toepassing";
      case ContactOutcome.UNKNOWN:
        return "Status onbekend";
    }
  }

  formatAsTime(dateTime: Date): string {
    return dateTime.toLocaleTimeString("nl-NL");
  }
  formatAsDate(dateTime: Date): string {
    return dateTime.toLocaleDateString("nl-NL");
  }
}
