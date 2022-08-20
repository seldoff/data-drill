import '../styles/App.css';
import {SelectedNodeResult} from './SelectedNodeResult';
import {Flow} from './Flow';
import {FlowContainer} from './FlowContainer';
import {ButtonsPanel} from './ButtonsPanel';
import {useEffect, useRef, useState} from 'react';

export function App() {
    const [height, setHeight] = useState<string>('100%');
    const outerDiv = useRef<HTMLDivElement>(null);
    const panelDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            const h = outerDiv.current!.offsetHeight - panelDiv.current!.offsetHeight;
            setHeight(`${h}px`);
        });
        observer.observe(outerDiv.current!);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={outerDiv} style={{height: '100vh', overflow: 'hidden'}}>
            <div ref={panelDiv} style={{padding: '4px'}}>
                <ButtonsPanel />
            </div>
            <div style={{height}}>
                <div style={{height: '70%'}}>
                    <FlowContainer>
                        <Flow />
                    </FlowContainer>
                </div>
                <div style={{height: '30%'}}>
                    <div style={{width: '100%', borderTop: '1px solid silver'}} />
                    <SelectedNodeResult />
                </div>
            </div>
        </div>
    );
}
