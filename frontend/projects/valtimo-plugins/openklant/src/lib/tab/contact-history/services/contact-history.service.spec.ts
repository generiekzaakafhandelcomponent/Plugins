import { TestBed } from '@angular/core/testing';

import { ContactHistoryService } from './contact-history.service';
import { DocumentService } from '@valtimo/document';
import { of } from 'rxjs';
import { mockKlantcontactDTO } from '../testing/mocks/mockKlantcontactDto';
import { mapDtoToModel } from '../models/klantcontact.model';

describe('ContactHistoryService', () => {
    let service: ContactHistoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DocumentService,
                    useValue: {
                        getDocument: jasmine
                            .createSpy('getDocument')
                            .and.returnValue(of({ content: { contactgeschiedenis: [mockKlantcontactDTO] } }))
                    }
                }
            ]
        });
        service = TestBed.inject(ContactHistoryService);
    });

    it('should be created', () => {
        expect(service).toBeInstanceOf(ContactHistoryService);
    });

    it('should return the contact history from the correct path in the document', done => {
        service.fetchFromDocument('mock-business-key').subscribe(contactHistoryResult => {
            expect(contactHistoryResult).toEqual([mapDtoToModel(mockKlantcontactDTO)]);
        });
        const getDocumentSpy = TestBed.inject(DocumentService).getDocument as jasmine.Spy;
        expect(getDocumentSpy).toHaveBeenCalledWith('mock-business-key');
        done();
    });
});
