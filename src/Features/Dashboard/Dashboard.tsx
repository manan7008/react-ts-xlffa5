import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/actions';
import { Provider, createClient, useQuery } from 'urql';
import { DashboardState, Measurement } from '../../models';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import MultipleSelect from '../../components/MultipleSelect';
import Chart from '../../components/Chart';

const useStyles = makeStyles({
  card: {
    margin: '1%',
    padding: '1rem',
  },
  cardContain: {
    padding: '1rem',
    width: '70%',
    display: 'flex',
    flexWrap: 'nowrap',
  },
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const fetMetricsQuery = `
{
  getMetrics
}
`;

const fetchData = `
query($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input)  {
    metric,
    measurements{
      at,
      value,
      metric,
      unit
    }
  }
}
`;

const getMetrics = (state: { dashboard: DashboardState }): { metrics: string[] } => {
  const { metrics } = state.dashboard;
  return {
    metrics,
  };
};

const getMeasurements = (state: { dashboard: DashboardState }): { measurements: Measurement[] } => {
  const { measurements } = state.dashboard;
  return {
    measurements,
  };
};

export default () => {
  return (
    <Provider value={client}>
      <Dashboard />
    </Provider>
  );
};

var styleTopCardContent = {
  div: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  selectDiv: {
    width: '30%',
  },
  chips: {
    width: '70%',
  },
  contain: {
    margin: '1rem',
    'background-color': '#fafafa',
    height: '94%',
  },
};

const Dashboard = () => {
  const classes = useStyles();

  const [selectedMetrics, setSelectedMetrics] = React.useState([]);

  const dispatch = useDispatch();
  const { metrics } = useSelector(getMetrics);
  const { measurements } = useSelector(getMeasurements);

  const onSelectChange = (value: any) => {
    var input =
      value && value.length
        ? value.map((s: any) => {
            var dt = new Date();
            dt.setMinutes(dt.getMinutes() - 30); // take last 30 Minutes data
            return {
              metricName: s,
              after: dt.getTime(),
            };
          })
        : [];
    setSelectedMetrics(input);
  };

  const [result] = useQuery({
    query: fetMetricsQuery,
    variables: {},
  });
  const { data, error } = result;

  const [result2] = useQuery({
    query: fetchData,
    variables: {
      input: selectedMetrics,
    },
  });

  useEffect(() => {
    if (error) {
      dispatch({ type: actions.API_ERROR, error: error.message });
      return;
    }
    if (!data) return;
    const { getMetrics } = data;
    dispatch({ type: actions.METRICS_DATA_RECEIVED, getMetrics });
  }, [dispatch, data, error]);

  useEffect(() => {
    if (result2.error) {
      dispatch({ type: actions.API_ERROR, error: result2.error.message });
      return;
    }
    if (!result2.data) return;
    const { getMultipleMeasurements } = result2.data;
    dispatch({
      type: actions.MEASUREMENTS_DATA_RECEIVED,
      getMultipleMeasurements,
    });
  }, [result2]);

  return (
    <div style={styleTopCardContent.contain}>
      <div style={styleTopCardContent.div}>
        <div style={styleTopCardContent.chips}>
          <div className={classes.cardContain}>
            {measurements.map(d => {
              return (
                <Card className={classes.card}>
                  <CardContent>
                    <div>
                      <b>{d.metric}</b>
                    </div>
                    <div>{d.measurements[d.measurements.length - 1].value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        <div style={styleTopCardContent.selectDiv}>
          <MultipleSelect names={metrics} onSelectChange={onSelectChange} />
        </div>
      </div>
      <div>
        <Chart measurements={measurements} />
      </div>
    </div>
  );
};
