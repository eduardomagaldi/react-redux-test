import { createStore,
		combineReducers,
		applyMiddleware
} from 'redux';
import axios from 'axios';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

const initialState = {
	fetching: false,
	fetched: false,
	users: [],
	error: null
}

const userReducer = (state = initialState, action) => {
	switch(action.type) {
		case 'FETCH_USERS_START': {
			state = {...state, name: action.payload};
			break;
		}
		case 'FETCH_USERS_ERROR': {
			state = {...state, age: action.payload};
			break;
		}
		case 'RECEIVE_USERS': {

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

// store.dispatch({type: 'CHANGE_NAME', payload: 'Eduardo'});
// store.dispatch({type: 'CHANGE_AGE', payload: 28});

store.dispatch((dispatch) => {
	dispatch({type: 'FETCH_USERS_START'});
	axios.get('http://rest.learcode.academy/api/wstern/users')
	.then((response) => {
		dispatch({type: 'RECEIVE_USERS', payload: response.data});
	})
	.catch((err) => {
		dispatch({type: 'FETCH_USERS_ERROR', payload: err});
	});

	//do something async
});
// store.dispatch({type: 'E'});