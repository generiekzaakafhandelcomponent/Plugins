import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OpenKlantSendKlantcontactComponent} from './open-klant-send-klantcontact.component';
import {OpenKlantSendKlantcontactConfig} from "../../models/open-klant-send-klantcontact-config";
import {BehaviorSubject, Subject} from "rxjs";
import {EventEmitter, NO_ERRORS_SCHEMA} from "@angular/core";
import {
    TranslateModule,
    TranslateLoader,
    TranslateFakeLoader,
} from '@ngx-translate/core';
import {PluginService} from "@valtimo/plugin";

const pluginServiceMock: Partial<PluginService> = {} as any;

describe('OpenKlantPostKlantcontactComponent', () => {
    let component: OpenKlantSendKlantcontactComponent;
    let fixture: ComponentFixture<OpenKlantSendKlantcontactComponent>;

    let save$: Subject<void>;
    let disabled$: BehaviorSubject<boolean>;

    const validFormValue: OpenKlantSendKlantcontactConfig = {
        kanaal: 'email',
        onderwerp: 'Subject',
        inhoud: 'Content',
        vertrouwelijk: 'true',
        taal: 'nld',
        plaatsgevondenOp: new Date().toISOString(),
        partijUuid: 'uuid-123',
        voorletters: 'J.D.',
        voornaam: 'John',
        voorvoegselAchternaam: 'van',
        achternaam: 'Doe',
    };

    const invalidFormValueMissingField: OpenKlantSendKlantcontactConfig = {
        kanaal: '',
        onderwerp: 'Subject',
        inhoud: 'Content',
        vertrouwelijk: 'true',
        taal: 'nld',
        plaatsgevondenOp: new Date().toISOString(),
        partijUuid: 'uuid-123',
        voorletters: 'J.D.',
        voornaam: 'John',
        voorvoegselAchternaam: 'van',
        achternaam: 'Doe',
    };


    beforeEach(async () => {
        save$ = new Subject<void>();
        disabled$ = new BehaviorSubject<boolean>(false);


        await TestBed.configureTestingModule({
            imports: [
                OpenKlantSendKlantcontactComponent,
                TranslateModule.forRoot({
                    loader: {provide: TranslateLoader, useClass: TranslateFakeLoader},
                }),
            ],
            providers: [
                {provide: PluginService, useValue: pluginServiceMock},
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();


        fixture = TestBed.createComponent(OpenKlantSendKlantcontactComponent);
        component = fixture.componentInstance;

        component.save$ = save$.asObservable();
        component.disabled$ = disabled$.asObservable();
        component.pluginId = 'plugin-123';

        component.valid = new EventEmitter<boolean>();
        component.configuration = new EventEmitter<OpenKlantSendKlantcontactConfig>();

        spyOn(component.valid, 'emit');
        spyOn(component.configuration, 'emit');

        fixture.detectChanges();
    });

    afterEach(() => {
        component.ngOnDestroy();
    });

    it('should create', () => {
        expect(component instanceof OpenKlantSendKlantcontactComponent).toBeTrue()
    });

    describe('lifecycle', () => {
        it('should open save subscription on init', () => {
            expect((component as any).saveSubscription).toBeDefined();
        });

        it('should unsubscribe on destroy', () => {
            const sub = (component as any).saveSubscription;
            spyOn(sub, 'unsubscribe').and.callThrough();

            component.ngOnDestroy();
            expect(sub.unsubscribe).toHaveBeenCalled();
        });
    });

    describe('validation', () => {
        it('should mark valid when all required fields are present', () => {
            component.formValueChange(validFormValue);
            expect(component.valid.emit).toHaveBeenCalledWith(true);
        });

        it('should mark valid when all required fields are present and vertrouwelijk is set to false', () => {
            const validFormValueWithConfidentialSetOnFalse: OpenKlantSendKlantcontactConfig = {
                kanaal: 'email',
                onderwerp: 'Subject',
                inhoud: 'Content',
                vertrouwelijk: 'false',
                taal: 'nld',
                plaatsgevondenOp: new Date().toISOString(),
                partijUuid: 'uuid-123',
                voorletters: 'J.D.',
                voornaam: 'John',
                voorvoegselAchternaam: 'van',
                achternaam: 'Doe',
            };

            component.formValueChange(validFormValueWithConfidentialSetOnFalse);
            expect(component.valid.emit).toHaveBeenCalledWith(true);
        });

        it('should mark invalid when any required field is missing or falsy', () => {
            component.formValueChange(invalidFormValueMissingField);
            expect(component.valid.emit).toHaveBeenCalledWith(false);
        });

        it('should emit multiple valid states as form changes', () => {
            component.formValueChange(invalidFormValueMissingField);
            component.formValueChange(validFormValue);

            expect(component.valid.emit).toHaveBeenCalledWith(false);
            expect(component.valid.emit).toHaveBeenCalledWith(true);
            expect((component as any).valid$.getValue()).toBeTrue();
        });
    });

    describe('save behavior', () => {
        it('should emit configuration when valid on save', () => {
            component.formValueChange(validFormValue);

            save$.next();

            expect(component.configuration.emit).toHaveBeenCalledTimes(1);
            expect(component.configuration.emit).toHaveBeenCalledWith(validFormValue);
        });

        it('should NOT emit configuration when invalid on save', () => {
            component.formValueChange(invalidFormValueMissingField);

            save$.next();

            expect(component.configuration.emit).not.toHaveBeenCalled();
        });

        it('should only take the latest snapshot at the moment of save', () => {
            component.formValueChange(invalidFormValueMissingField);

            component.formValueChange(validFormValue);

            save$.next();

            expect(component.configuration.emit).toHaveBeenCalledTimes(1);
            expect(component.configuration.emit).toHaveBeenCalledWith(validFormValue);
        });
    });

    describe('formValueChange', () => {
        it('should update internal formValue$ state', () => {
            component.formValueChange(validFormValue);
            const current = (component as any).formValue$.getValue();
            expect(current).toEqual(validFormValue);
        });

        it('should compute and emit validity when formValue changes', () => {
            component.formValueChange(invalidFormValueMissingField);
            expect(component.valid.emit).toHaveBeenCalledWith(false);

            component.formValueChange(validFormValue);
            expect(component.valid.emit).toHaveBeenCalledWith(true);
        });
    });
});
