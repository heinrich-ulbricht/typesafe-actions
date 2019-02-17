import * as React from 'react';
import { RootAction } from 'MyTypes';
import { getType } from 'typesafe-actions';

import { Todo } from './models';
import * as actions from './actions';

type RemoteData<T> = any;

export type SandboxState = Readonly<{
  todos: RemoteData<Todo[]>;
}>;

const TodoList = ({ todos }: SandboxState) => {
  const Items = todos.resolve({
    pending: cachedData => [<Loader />, cachedData],
    error: (err, cachedData) => {
      console.log('');
      return cachedData;
    },
    ready: (data, cachedData) => data.map(i => i.title),
  });
};

export default (
  state = [
    {
      id: '0',
      title: 'You can add new todos using the form or load saved snapshot...',
    },
  ],
  action: RootAction
) => {
  switch (action.type) {
    case getType(actions.addTodo):
      return state.setCache([...state.getCache(), action.payload]);

    case getType(actions.removeTodo):
      return state.setCache(
        state.getCache().filter(i => i.id !== action.payload)
      );

    case getType(actions.loadTodosAsync.request):
      return state.toPending();

    case getType(actions.loadTodosAsync.failure):
      return state.toError(action.payload);

    case getType(actions.loadTodosAsync.success):
      return state.toReady(action.payload);

    case getType(actions.loadTodosAsync):
      return reduceAsyncAction(actions.loadTodosAsync, payload => payload)(
        state,
        action
      );

    default:
      return state;
  }
};
