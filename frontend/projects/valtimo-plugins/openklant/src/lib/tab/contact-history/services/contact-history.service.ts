import {
  DocumentService,
  Document as ValtimoDocument,
} from "@valtimo/document";
import { map, Observable } from "rxjs";
import {
  Klantcontact,
  mapDtoToModel,
} from "../components/models/klantcontact.model";
import { DocumentContentWithContactHistory } from "../components/models/document-content.model";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ContactHistoryService {
  constructor(private documentService: DocumentService) {}

  load(documentId: string): Observable<Klantcontact[]> {
    return this.documentService.getDocument(documentId).pipe(
      map((doc) => {
        const valtimoDoc = doc as ValtimoDocument;
        const content = valtimoDoc.content as DocumentContentWithContactHistory;

        return content.contactgeschiedenis.map(mapDtoToModel);
      })
    );
  }
}
