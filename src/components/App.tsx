import '../styles/App.css';
import {SelectedNodeResultTable} from './SelectedNodeResultTable';
import {Flow} from './Flow';
import {FlowContainer} from './FlowContainer';
import {ButtonsPanel} from './ButtonsPanel';

export function App() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
            }}
        >
            <ButtonsPanel />
            <div style={{height: '70%'}}>
                <FlowContainer>
                    <Flow />
                </FlowContainer>
            </div>
            <div style={{width: '100%', borderTop: '1px solid silver'}} />
            <div style={{height: '30%'}}>
                <SelectedNodeResultTable />
            </div>
        </div>
    );
}

export default App;
