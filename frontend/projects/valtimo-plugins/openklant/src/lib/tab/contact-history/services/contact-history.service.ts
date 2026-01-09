import {DocumentService, Document as ValtimoDocument} from '@valtimo/document';
import {map, Observable} from 'rxjs';
import {CustomerContact, mapDtoToModel} from '../components/models/customer-contact.model';
import {DocumentContentWithContactHistory} from '../components/models/document-content.model';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ContactHistoryService {
    constructor(private documentService: DocumentService) {}

    load(documentId: string): Observable<CustomerContact[]> {
        return this.documentService.getDocument(documentId).pipe(
            map(doc => {
                const valtimoDoc = doc as ValtimoDocument;
                const content = valtimoDoc.content as DocumentContentWithContactHistory;

                return content.contactgeschiedenis.map(mapDtoToModel);
            })
        );
    }
}
