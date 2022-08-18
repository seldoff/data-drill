import React, {ReactNode, useEffect, useRef, useState} from 'react';

export function FlowContainer(props: {children: ReactNode}) {
    const [size, setSize] = useState<{width: number; height: number}>({width: 0, height: 0});
    const outsideDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            setSize({
                width: outsideDivRef.current!.offsetWidth,
                height: outsideDivRef.current!.offsetHeight,
            });
        });
        observer.observe(outsideDivRef.current!);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={outsideDivRef} style={{height: '100%', width: '100%'}}>
            <div style={size}>{props.children}</div>
        </div>
    );
}
