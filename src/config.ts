export function getStage() {
    console.log("process.env.STAGE", process.env.STAGE)
    return "" + process.env.STAGE
}

export function getPaymentEndpoint() {
    return "" + process.env.PAYMENT_ENDPOINT
}

export function getAuthEndpoint() {
    return "" + process.env.AUTH_ENDPOINT
}

export function getAccountEndpoint() {
    return "" + process.env.ACCOUNT_ENDPOINT
}

export function getProductEndpoint() {
    return "" + process.env.PRODUCT_ENDPOINT
}

export function getRegionEndpoint() {
    return "" + process.env.REGION_ENDPOINT
}

export function getOrganizationEndpoint(regionId: string) {
    switch (regionId.toLowerCase()) {
        case "seoul": {
            return "" + process.env.ORGANIZATION_SEOUL_ENDPOINT
        }
        default: {
            return "" + process.env.ORGANIZATION_ENDPOINT
        }
    }
}

export function getCalmIslandOrgID() {
    return "" + process.env.CALM_ORG_ID
}