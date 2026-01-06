interface CreateProductConfig {
    productNaam: string;
    productTypeUuid: string;
    eigenaarBsn: string;
    eigenaarData: Array<{ key: string; value: string }>;
    aanvraagZaakUrn: string;
    aanvraagZaakUrl: string;
    gepubliceerd: boolean;
    productPrijs: string;
    productFrequentie: string;
    productStatus: string;
    resultaatPV: string;
}

export {CreateProductConfig};
