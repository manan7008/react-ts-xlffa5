

export interface Measurement {
    at?: number,
    value?: number,
    metric: string,
    unit?: string,
    __typename: string,
    measurements: Measurement[]
}

export interface DashboardState {
    metrics: string[],
    measurements: Measurement[],
}