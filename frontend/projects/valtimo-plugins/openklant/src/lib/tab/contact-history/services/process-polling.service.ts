import {filter, Observable, switchMap, takeUntil, takeWhile, tap} from 'rxjs';
import {PollingService} from './polling.service';
import {ProcessInstance, ProcessService} from '@valtimo/process';
import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';

@Injectable({providedIn: 'root'})
export class ProcessPollingService {
    constructor(
        private pollingService: PollingService,
        private processService: ProcessService,
        private readonly logger: NGXLogger
    ) {}

    pollUntilStopped(
        processInstanceId: string,
        startIntervalInMs: number,
        maxPollingTimeInMs: number,
        destroy$: Observable<void>
    ): Observable<ProcessInstance> {
        return this.pollingService.createExponentialPollingTicks(startIntervalInMs, maxPollingTimeInMs, destroy$).pipe(
            switchMap(() => this.processService.getProcessInstance(processInstanceId)),
            tap(process =>
                this.logger.debug(
                    process.endTime
                        ? `Retrieved process with endTime: ${process.endTime}`
                        : `Retrieved process instance without an endtime`
                )
            ),
            takeWhile(process => !process?.endTime, true),
            filter(process => !!process.endTime),
            takeUntil(destroy$)
        );
    }
}
