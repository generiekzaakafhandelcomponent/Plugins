import {TestBed} from '@angular/core/testing';

import {ProcessPollingService} from './process-polling.service';
import {PollingService} from './polling.service';
import {of} from 'rxjs';
import {ProcessService} from '@valtimo/process';
import {NGXLogger} from 'ngx-logger';
import {mockProcessInstance} from '../components/models/mocks';

describe('ProcessPollingService', () => {
    let service: ProcessPollingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProcessPollingService,
                {
                    provide: PollingService,
                    useValue: {
                        createExponentialPollingTicks: jasmine
                            .createSpy('createExponentialPollingTicks')
                            .and.returnValue(of(null, null))
                    }
                },
                {
                    provide: ProcessService,
                    useValue: {getProcessInstance: jasmine.createSpy('getProcessInstance')}
                },
                {
                    provide: NGXLogger,
                    useValue: {
                        debug: jasmine.createSpy('debug')
                    }
                }
            ]
        });
        service = TestBed.inject(ProcessPollingService);
    });

    it('should be created', () => {
        expect(service).toBeInstanceOf(ProcessPollingService);
    });

    it(`should return the first process instance that has an endTime`, done => {
        const processService = TestBed.inject(ProcessService);
        (processService.getProcessInstance as jasmine.Spy).and.returnValues(
            of(mockProcessInstance),
            of({...mockProcessInstance, endTime: '2025-12-18T15:15:00Z'})
        );

        service.pollUntilStopped('mock-process-instance-id', 100, 800, of()).subscribe(process => {
            expect(process.endTime).toBe('2025-12-18T15:15:00Z');
            done();
        });
    });

    it(`should not return anything if process instances fetched before the maxPollingTimeInMs don't have an endTime`, done => {
        const processService = TestBed.inject(ProcessService);
        (processService.getProcessInstance as jasmine.Spy).and.returnValues(
            of(mockProcessInstance),
            of(mockProcessInstance),
            of(mockProcessInstance)
        );

        service.pollUntilStopped('mock-process-instance-id', 100, 800, of()).subscribe({
            next: () => fail('No process instances have endTime, so nothing should emit'),
            complete: () => done()
        });
    });
});
