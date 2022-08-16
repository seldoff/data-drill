import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import {App} from './components/App';
import {connectToDb} from './sql/sqlite';
//import reportWebVitals from "./reportWebVitals";
import {store, schemaActions} from './redux/store';
import {Provider} from 'react-redux';
import {buildSchema} from './schema';
import {Spinner} from './components/Spinner';
import {DbContext} from './components/DbContext';
import {patchConsoleForFlow} from './utils';

patchConsoleForFlow();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Spinner />);

const db = await connectToDb();
const schema = buildSchema(db);
store.dispatch(schemaActions.schemaLoaded(schema));

root.render(
    <React.StrictMode>
        <DbContext.Provider value={db}>
            <Provider store={store}>
                <App />
            </Provider>
        </DbContext.Provider>
    </React.StrictMode>
);

//reportWebVitals(console.log);
