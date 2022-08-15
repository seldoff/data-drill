import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './components/App';
import {connectToDb, executeQuery} from './sql/sqlite';
//import reportWebVitals from "./reportWebVitals";
import {store, schemaActions} from './redux/store';
import {Provider} from 'react-redux';
import {buildSchema} from './schema';
import {MNode, Model} from './model';
import {QueryExecResult} from 'sql.js';
import {generateQuery} from './sql/generateQuery';
import {bind, map, Result} from './utils';
import {printQuery} from './sql/printQuery';
import {Spinner} from './components/Spinner';
import {ExecuteQueryContext} from './components/ExecuteQueryContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Spinner />);

const db = await connectToDb();
const schema = buildSchema(db);
store.dispatch(schemaActions.schemaLoaded(schema));

function executeQueryImpl(node: MNode, model: Model): Result<QueryExecResult> {
    const sql = map(generateQuery(node, model), printQuery);
    return bind(sql, sql => executeQuery(db, sql));
}

root.render(
    <React.StrictMode>
        <ExecuteQueryContext.Provider value={executeQueryImpl}>
            <Provider store={store}>
                <App />
            </Provider>
        </ExecuteQueryContext.Provider>
    </React.StrictMode>
);

//reportWebVitals(console.log);
