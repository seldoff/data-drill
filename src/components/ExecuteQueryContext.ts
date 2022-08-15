import React from 'react';
import {MNode, Model} from '../model';
import {Result} from '../utils';
import {QueryExecResult} from 'sql.js';

type ExecuteQueryFunc = (node: MNode, model: Model) => Result<QueryExecResult>;
export const ExecuteQueryContext = React.createContext<ExecuteQueryFunc | undefined>(undefined);
