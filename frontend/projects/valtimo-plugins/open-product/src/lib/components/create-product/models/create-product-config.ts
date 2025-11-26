interface CreateProductConfig {
    productNaam: string;
    productTypeUUID: string;
    burgerBSN: string;
    eigenaarData: Array<{ key: string; value: string }>;
    gepubliceerd: boolean;
    productPrijs: string;
    frequentie: string;
    status: string;
}

export {CreateProductConfig};
