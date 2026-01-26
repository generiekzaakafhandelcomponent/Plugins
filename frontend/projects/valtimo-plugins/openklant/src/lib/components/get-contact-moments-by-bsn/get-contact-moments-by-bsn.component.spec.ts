import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';

import { GetContactMomentsByBsnComponent } from './get-contact-moments-by-bsn.component';
import { GetContactMomentsByBsnConfig } from '../../models/get-contact-moments-by-bsn-config';

describe('OpenKlantGetContactMomentsByCaseUuidComponent', () => {
    let component: GetContactMomentsByBsnComponent;
    let fixture: ComponentFixture<GetContactMomentsByBsnComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GetContactMomentsByBsnComponent]
        })
            .overrideTemplate(GetContactMomentsByBsnComponent, '')
            .compileComponents();

        fixture = TestBed.createComponent(GetContactMomentsByBsnComponent);
        component = fixture.componentInstance;

        component.save$ = EMPTY;
        component.disabled$ = of(false);
        component.pluginId = 'test-plugin';

        const minimalPrefill: GetContactMomentsByBsnConfig = {
            resultPvName: '',
            bsn: ''
        } as GetContactMomentsByBsnConfig;
        component.prefillConfiguration$ = of(minimalPrefill);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component instanceof GetContactMomentsByBsnComponent).toBeTrue();
    });
});
