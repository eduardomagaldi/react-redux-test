import {applyMiddleware, createStore, combineReducers} from 'redux';

import logger from 'redux-logger'
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'

import React from 'react'
import ReactDOM from 'react-dom'

import { Provider, connect } from 'react-redux'

import axios from 'axios'

//reducers.js

const tweets = (state={
	tweets: [],
	fetching: false,
	fetched: false,
	error: null
}, action) => {
	switch(action.type) {
		case 'FETCH_TWEETS': {
			return {...state, fetching: true}
		}
		case 'FETCH_TWEETS_REJECTED': {
			return {
				...state,
				fetching: false,
				error: action.payload
			}
		}
		case 'FETCH_TWEETS_FULFILLED': {
			return {
				...state,
				fetching: false,
				fetched: true,
				tweets: action.payload
			}
		}
	}

	return state;
}

const user = (state={
	user: {
		id: null,
		name: null,
		age: null
	},
	fetching: false,
	fetched: false,
	error: null
}, action) => {
	switch(action.type) {
		case 'FETCH_USERS': {
			return {...state, fetching: true}
		}
		case 'FETCH_USERS_REJECTED': {
			return {
				...state,
				fetching: false,
				error: action.payload
			}
		}
		case 'FETCH_USERS_FULFILLED': {
			return {
				...state,
				fetching: false,
				fetched: true,
				user: action.payload
			}
		}
	}

	return state;
}

const reducer = combineReducers({
	tweets,
	user
})

//store.js

const middleware = applyMiddleware(promise(), thunk, logger())

const store = createStore(reducer, middleware);

//actions.js

const fetchUser = () => {
	return {
		type: 'FETCH_USERS_FULFILLED',
		payload: {
			name: 'Eduardo',
			age: 28
		}
	}
}

const fetchTweets = () => {
	return (dispatch) => {
		axios.get('/data/tweets.json')
			.then((response) => {
				dispatch({
					type: 'FETCH_TWEETS_FULFILLED',
					payload: response.data
				})
			})
			.catch((err) => {
				dispatch({
					type: 'FETCH_TWEETS_REJECTED',
					payload: response.err
				})
			})
	}
}

//layout.js

@connect((store) => {
	return {
		user: store.user.user,
		userFetched: store.user.fetched,
		tweets: store.tweets.tweets
	}
})

class Layout extends React.Component {
	componentWillMount() {
		this.props.dispatch(fetchUser())
	}

	fetchTweets() {
		this.props.dispatch(fetchTweets())
	}

	render() {
		const { user, tweets } = this.props;

		if (!tweets.length) {
			return <button
				onClick={this.fetchTweets.bind(this)}
				>
				Load tweets
			</button>
		}

		const mappedTweets = tweets.map((tweet, index) => <li key={index}>{tweet.text}</li>)
		return (
			<div>
				<h1>{user.name}</h1>
				<ul>{mappedTweets}</ul>
			</div>
		);
	}
}

//client.js

const app = document.getElementById('app')

ReactDOM.render(<Provider store={store}>
	<Layout />
</Provider>, app);



