import { createStore,
		combineReducers,
		applyMiddleware
} from 'redux';

import logger from 'redux-logger';
import thunk from 'redux-thunk';

const userReducer = (state = {name: 'bla',  age: 0}, action) => {
	switch(action.type) {
		case 'CHANGE_NAME': {
			state = {...state, name: action.payload};
			break;
		}
		case 'CHANGE_AGE': {
			state = {...state, age: action.payload};
			break;
		}
		case 'E': {
			throw new Error('AHHHH!');
			break;
		}
	}
	return state;
};

const tweetsReducer = (state = [], action) => {
	return state;
};

const reducers = combineReducers({
	user: userReducer,
	tweetsReducer: tweetsReducer
});

const actionLogger = (store) => (next) => (action) => {
	console.log('action fired', action);
	next(action);
}

const error = (store) => (next) => (action) => {
	try {
		next(action);
	} catch(e) {
		console.log('AHHHHH!!!!', e);
	}
}

const middleware = applyMiddleware(logger(), thunk);

const store = createStore(reducers, middleware);

// store.subscribe(() => {
// 	console.log('store changed', store.getState());
// });

store.dispatch({type: 'CHANGE_NAME', payload: 'Eduardo'});
store.dispatch({type: 'CHANGE_AGE', payload: 28});

store.dispatch((dispatch) => {
	dispatch({});
	//do something async
	dispatch({});
});
// store.dispatch({type: 'E'});