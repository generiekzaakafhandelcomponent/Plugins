/*!
 * Copyright 2015-2024 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Toggle} from 'carbon-components-angular';
import {CompleteExterneKlanttaakV1x1x0Config} from "../../models";

@Component({
    selector: 'valtimo-complete-externe-klanttaak-v1x1x0-form',
    templateUrl: './complete-externe-klanttaak-v1x1x0-form.component.html',
    styleUrl: './complete-externe-klanttaak-v1x1x0-form.component.scss',
})
export class CompleteExterneKlanttaakV1x1x0FormComponent {
    @Input({required: true}) disabled$: Observable<boolean>;
    @Input({required: true}) pluginId: string;
    @Input() prefillConfiguration$: Observable<CompleteExterneKlanttaakV1x1x0Config>;
    @Output() readonly value$ = new BehaviorSubject<CompleteExterneKlanttaakV1x1x0Config | null>(null);
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('bewaarIngediendeGegevens') bewaarIngediendeGegevens: Toggle;
    @ViewChild('koppelDocumenten') koppelDocumenten: Toggle;
    protected readonly formValue$ = new BehaviorSubject<CompleteExterneKlanttaakV1x1x0Config | null>(null);

    constructor(
        private readonly changeDetection: ChangeDetectorRef,
    ) {
    }

    formValueChange(formValue: CompleteExterneKlanttaakV1x1x0Config): void {
        let valid =
            !!(!this.bewaarIngediendeGegevens?.checked || !!formValue.verzondenDataMapping) &&
            !!(!this.koppelDocumenten?.checked || !!formValue.documentPadenPad);

        if (valid) {
            this.value$.next({
                bewaarIngediendeGegevens: this.bewaarIngediendeGegevens.checked,
                koppelDocumenten: this.koppelDocumenten.checked,
                ...formValue
            });
        }

        this.valid.emit(valid);
        this.formValue$.next(formValue);
        this.changeDetection.detectChanges();
    }
}