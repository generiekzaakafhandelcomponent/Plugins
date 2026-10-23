/*
 * Copyright 2026 Ritense BV, the Netherlands.
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

import {AfterViewChecked, Directive, ElementRef, Input} from "@angular/core";

/*
 * v-input only binds its placeholder input on text inputs, not on its textarea and password inputs.
 * This sets the placeholder on whichever input or textarea v-input renders.
 */
@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: 'v-input[vInputPlaceholder]',
})
export class VInputPlaceholderDirective implements AfterViewChecked {
    @Input() vInputPlaceholder: string | null = '';

    constructor(private readonly elementRef: ElementRef<HTMLElement>) {
    }

    ngAfterViewChecked(): void {
        const input = this.elementRef.nativeElement.querySelector('input, textarea');
        const placeholder = this.vInputPlaceholder ?? '';
        if (input && input.getAttribute('placeholder') !== placeholder) {
            input.setAttribute('placeholder', placeholder);
        }
    }
}
