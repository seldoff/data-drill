import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './components/App';
import {connectToDb} from './sqlite';
//import reportWebVitals from "./reportWebVitals";
import {store, schemaActions} from './redux/store';
import {Provider} from 'react-redux';
import {buildSchema} from './schema';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);

connectToDb()
    .then(db => buildSchema(db))
    .then(schema => store.dispatch(schemaActions.schemaLoaded(schema)))
    .catch(console.error);

//reportWebVitals(console.log);
