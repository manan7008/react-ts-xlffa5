import { DashboardState, Measurement } from './../../models/index';
import * as actions from "../../store/actions";

const initialState = {
  metrics: [],
  measurements: []
};


const metricsDataReceived = (state: DashboardState, action: { getMetrics: string[] }) => {
  const { getMetrics } = action;

  return {
    ...state,
    metrics: getMetrics
  };
};

const measurementsDataReceived = (state: DashboardState, action: { getMultipleMeasurements: Measurement[] }) => {
  const { getMultipleMeasurements } = action;
  return {
    ...state,
    measurements: getMultipleMeasurements
  };
};

const handlers: any = {
  [actions.METRICS_DATA_RECEIVED]: metricsDataReceived,
  [actions.MEASUREMENTS_DATA_RECEIVED]: measurementsDataReceived
};


export default (state = initialState, action: typeof handlers): DashboardState => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};
