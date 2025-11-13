interface CreateProductConfig {
    productName: string;
    productTypeUUID: string;
    citizenBSN: string;
    ownerData: Array<{ key: string; value: string }>;
    published: boolean;
    productPrice: string;
    frequency: string;
    status: string;
    resultPV: string;
}

export {CreateProductConfig};
