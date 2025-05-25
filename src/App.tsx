import type {ReactNode} from 'react';
import './App.css'
import {SortableTree} from "@/components";

function App() {
    const Wrapper = ({children}: { children: ReactNode }) => (
        <div
            style={{
                padding: 10,
                margin: '0 auto',
            }}
        >
            {children}
        </div>
    );
    return (
        <Wrapper>
            <SortableTree collapsible indicator removable/>
        </Wrapper>
    )
}

export default App
