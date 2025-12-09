interface CreateProductConfig {
    productNaam: string;
    productTypeUUID: string;
    burgerBSN: string;
    eigenaarData: Array<{ key: string; value: string }>;
    aanvraagZaakUrn: string;
    aanvraagZaakUrl: string;
    gepubliceerd: boolean;
    productPrijs: string;
    frequentie: string;
    status: string;
    resultaatPV: string;
}

export {CreateProductConfig};
