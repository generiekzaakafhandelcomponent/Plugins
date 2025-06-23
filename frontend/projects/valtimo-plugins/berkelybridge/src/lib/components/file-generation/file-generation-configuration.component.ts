/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FunctionConfigurationComponent} from '@valtimo/plugin';
import {
    BehaviorSubject,
    combineLatest,
    map,
    Observable, of, Subject,
    Subscription,
    take,
} from 'rxjs';
import {FileGeneratieConfig} from "../../models";
import {DocumentLanguage, SelectItem} from "@valtimo/components";
import {TranslateService} from "@ngx-translate/core";
import {DocumentService} from "@valtimo/document";
import {OpenZaakService} from "@valtimo/resource";

@Component({
    selector: 'valtimo-text-generation-configuration',
    templateUrl: './file-generation-configuration.component.html',
    styleUrls: ['./file-generation-configuration.component.scss'],
})
export class FileGenerationConfigurationComponent
    implements FunctionConfigurationComponent, OnInit, OnDestroy {
    @Input() disabled$: Observable<boolean>;
    @Input() pluginId: string;
    @Input() prefillConfiguration$: Observable<FileGeneratieConfig>;
    @Input() save$: Observable<void>;
    @Output() configuration: EventEmitter<FileGeneratieConfig> = new EventEmitter<FileGeneratieConfig>();
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();

    private readonly formValue$ = new BehaviorSubject<FileGeneratieConfig | null>(null);
    private saveSubscription!: Subscription;
    private readonly valid$ = new BehaviorSubject<boolean>(false);

    readonly LANGUAGES: Array<DocumentLanguage> = ['nld', 'eng', 'deu'];
    readonly languageItems$: Observable<Array<SelectItem>> = this.translateService.stream('key').pipe(
        map(() =>
            this.LANGUAGES.map(language => ({
                id: language,
                text: this.translateService.instant(`document.${language}`),
            }))
        )
    );

    readonly formatItems$: Observable<Array<SelectItem>> = of(['pdf', 'docx']).pipe(
        map(format => (
                format.map(value => ({
                    id: value,
                    text: value,
                }))
            )
        ));

    readonly informatieObjectTypes$: Observable<Array<SelectItem>> = this.openzaakService.getInformatieObjectTypes().pipe(
        map(types => types.map(type => ({id: type.url, text: type.omschrijving})))
    );

    constructor(
        private readonly translateService: TranslateService,
        private readonly documentService: DocumentService,
        private readonly openzaakService: OpenZaakService,
    ) {
    }

    public ngOnInit(): void {
        this.openSaveSubscription();
    }

    public ngOnDestroy(): void {
        this.saveSubscription?.unsubscribe();
    }

    public formValueChange(formValue: FileGeneratieConfig): void {
        this.formValue$.next(formValue);
        this.handleValid(formValue);
    }

    private handleValid(formValue: FileGeneratieConfig): void {
        const valid = !!(formValue.modelId)
            && !!(formValue.templateId)
            && !!(formValue.taal)
            && !!(formValue.naam)
            && !!(formValue.format)
            && !!(formValue.variabeleNaam);

        this.valid$.next(valid);
        this.valid.emit(valid);
    }

    private openSaveSubscription(): void {
        this.saveSubscription = this.save$?.subscribe(save => {
            combineLatest([this.formValue$, this.valid$])
                .pipe(take(1))
                .subscribe(([formValue, valid]) => {
                    if (valid) {
                        this.configuration.emit(formValue);
                    }
                });
        });
    }
}
