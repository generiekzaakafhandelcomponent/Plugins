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
} from "../../models/klantcontact.model";
import { ProcessPollingService } from "../../services/process-polling.service";
import { ContactHistoryService } from "../../services/contact-history.service";
import { getOutcomeTranslationKey } from "../../presenters/contact-outcome.presenter";
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ConfigService } from "@valtimo/shared";
import { HttpBackend, HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

@Component({
  selector: "generieke-contactgeschiedenis",
  standalone: true,
  imports: [
    NgForOf,
    TimelineModule,
    NgClass,
    NgIf,
    CarbonListModule,
    LoadingModule,
    CommonModule,
    TranslateModule // Note: the path to Open Klant's non-plugin translations was added in 'environments.ts' under 'translationResources'
  ], providers: [
    {
      provide: TranslateLoader,
      useFactory: (http: HttpClient) => new TranslateHttpLoader(http, '/assets/i18n/open-klant/', '.json'),
      deps: [HttpBackend, ConfigService],
    },
  ],
  templateUrl: "./contact-history-tab.component.html",
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

  private _contactHistory: KlantContact[] = [];
  get contactHistory() {
    return this._contactHistory;
  }
  set contactHistory(contactHistory) {
    this._contactHistory = contactHistory;
  }

  // Expose presenter function for use in template
  readonly getOutcomeTranslationKey = getOutcomeTranslationKey;

  // Expose ContactOutcome enum for use in template
  readonly ContactOutcome = ContactOutcome;


  constructor(
    private route: ActivatedRoute,
    private processService: ProcessService,
    private processPollingService: ProcessPollingService,
    private contactHistoryService: ContactHistoryService,
    private readonly logger: NGXLogger
  ) { }

  ngOnInit() {
    const snapshot = this.route.snapshot.paramMap;
    this.documentId = snapshot.get("documentId") ?? "";

    if (!this.documentId) {
      this.isLoading = false;
      this.isFailed = true;
      return;
    }

    this.fetchLocalContactHistoryFromDocument()

    this.fetchFreshContactHistory()
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    this.retrievedFreshContactHistory$.next();
    this.retrievedFreshContactHistory$.complete();
  }

  private fetchLocalContactHistoryFromDocument() {
    this.contactHistoryService
      .fetchFromDocument(this.documentId)
      .pipe(
        takeUntil(this.destroy$),
        takeUntil(this.retrievedFreshContactHistory$)
      )
      .subscribe((contacts) => (this.contactHistory = contacts));
  }

  private fetchFreshContactHistory() {
    this.processService
      .startProcesInstance(this.PROCESS_KEY, this.documentId, new Map())
      ?.pipe(
        switchMap((process) => {
          return process.ended
            ? of(null)
            : this.pollUntilStoppedWrapper(process.id);
        }),
        switchMap(() => this.contactHistoryService.fetchFromDocument(this.documentId)),
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

  protected formatAsTime(dateTime: Date): string {
    return dateTime.toLocaleTimeString("nl-NL");
  }
  protected formatAsDate(dateTime: Date): string {
    return dateTime.toLocaleDateString("nl-NL");
  }
}
