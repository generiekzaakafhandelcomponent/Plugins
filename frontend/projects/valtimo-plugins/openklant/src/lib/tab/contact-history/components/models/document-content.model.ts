import {CustomerContactDTO} from './customer-contact.model';

export interface DocumentContentWithContactHistory {
    contactgeschiedenis: CustomerContactDTO[];
}
