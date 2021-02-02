import { spawn } from 'redux-saga/effects';
import weatherSaga from '../Features/saga';

export default function* root() {
  yield spawn(weatherSaga);
}
