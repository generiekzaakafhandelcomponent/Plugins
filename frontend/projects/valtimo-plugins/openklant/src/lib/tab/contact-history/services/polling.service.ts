import {expand, Observable, of, skip, takeUntil, timer} from 'rxjs';

import {Injectable} from '@angular/core';
@Injectable({providedIn: 'root'})
export class PollingService {
    createExponentialPollingTicks(initialIntervalInMs: number, maxTimeInMs: number, stop$: Observable<any>) {
        return of(null).pipe(
            expand((_, iteration) => {
                const delayInMs = initialIntervalInMs * Math.pow(2, iteration);
                return timer(delayInMs);
            }),
            takeUntil(timer(maxTimeInMs)),
            takeUntil(stop$),
            skip(1) // skip the initial null value
        );
    }
}
