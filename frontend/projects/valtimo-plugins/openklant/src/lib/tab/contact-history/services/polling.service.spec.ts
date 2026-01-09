import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import {PollingService} from './polling.service';
import {Subject} from 'rxjs';
import exp from 'constants';

describe('PollingService', () => {
    let service: PollingService;

    beforeEach(() => {
        service = TestBed.inject(PollingService);
    });

    it('should be created', () => {
        expect(service).toBeInstanceOf(PollingService);
    });

    it('should emit ticks each exponentially further apart until maxTimeInMs has passed', fakeAsync(() => {
        const initialIntervalInMs = 100;
        const maxTimeInMs = 1500;
        const stop$ = new Subject<void>();

        const ticks: string[] = [];

        service.createExponentialPollingTicks(initialIntervalInMs, maxTimeInMs, stop$).subscribe(() => {
            ticks.push('Poll now!');
        });

        // Simulation of time passing
        tick(100); // skips initial value
        tick(200);
        tick(400);
        tick(800); // reaches final tick (3)

        expect(ticks.length).withContext(`Not the number of ticks expected`).toBe(3);
    }));
    it('should emit until stop$', fakeAsync(() => {
        const initialIntervalInMs = 100;
        const maxTimeInMs = 1500;
        const stop$ = new Subject<void>();

        const ticks: string[] = [];

        service.createExponentialPollingTicks(initialIntervalInMs, maxTimeInMs, stop$).subscribe(() => {
            ticks.push('Poll now!');
        });

        tick(100); // first tick happens after 100ms
        stop$.next(); // stop emitting ticks
        tick(2500); // allow for time to keep emitting ticks in case of issues

        expect(ticks.length).withContext(`Not the number of ticks expected`).toBe(1);
    }));
});
