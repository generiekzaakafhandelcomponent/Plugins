import {ComponentFixture, TestBed} from '@angular/core/testing';
import {EMPTY, of} from 'rxjs';

import {OpenKlantPluginConfigurationComponent} from './open-klant-plugin-configuration.component';
import {Config} from '../../models/config';

describe('OpenKlantPluginConfigurationComponent', () => {
    let component: OpenKlantPluginConfigurationComponent;
    let fixture: ComponentFixture<OpenKlantPluginConfigurationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OpenKlantPluginConfigurationComponent]
        })
            .overrideTemplate(OpenKlantPluginConfigurationComponent, '')
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(OpenKlantPluginConfigurationComponent);
        component = fixture.componentInstance;

        component.save$ = EMPTY;
        component.disabled$ = of(false);
        component.pluginId = 'test-plugin';

        component.prefillConfiguration$ = of({
            configurationTitle: '',
            klantinteractiesUrl: '',
            token: ''
        } as unknown as Config);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
