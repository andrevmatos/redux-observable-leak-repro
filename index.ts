import { createEpicMiddleware } from "redux-observable";
import { applyMiddleware, createStore, Action } from 'redux';
import { Observable, range } from "rxjs";
import { filter, map, mergeMap } from "rxjs/operators";

interface State {
  str: string;
}

const StartActionType = 'START';
interface StartAction extends Action<typeof StartActionType> {
}

const SetStrActionType = 'SET_STR';
interface SetStrAction extends Action<typeof SetStrActionType> {
  payload: string;
}

type Actions = SetStrAction | StartAction;

const initialState: State = {
  str: '',
}

function reducer(state = initialState, action: Actions): State {
  if (action.type === SetStrActionType)
    state = { str: action.payload };
  return state;
}

const deps = {};
const epicMiddleware = createEpicMiddleware<Actions, Actions, State, typeof deps>({ dependencies: deps });

const store = createStore(reducer, initialState, applyMiddleware(epicMiddleware));

function rootEpic(action$: Observable<Actions>): Observable<Actions> {
  return action$.pipe(
    filter((action) => action.type === StartActionType),
    mergeMap(() => range(0, 50e3)),
    mergeMap((c) => [''.padStart(c, 'a')]),
    // tap((a) => console.info('__a', a)),
    map((s): SetStrAction => ({ type: SetStrActionType, payload: s })),
  );
}

function main() {
  process.on('SIGINT', () => process.exit());
  process.on('SIGTERM', () => process.exit());

  epicMiddleware.run(rootEpic);
  store.dispatch({ type: StartActionType });

  setImmediate(() => console.info('__end'));
  setTimeout(() => console.info('__exit'), 3600e3);
}

main();
