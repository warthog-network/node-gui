import { useMemo, useEffect, useState } from 'react'
import Sidebar from './Sidebar.jsx'
import { Routes, Route } from 'react-router-dom';
import Overview from './pages/overview.jsx'
import Peers from './pages/peers.jsx'
import Chain from './pages/chain.jsx'
import APIClient from './assets/api_ws.js'
import './App.css'

import React from 'react';



function App() {
    const [client, setClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [connections, setConnections] = useState([]);
    const [chain, setChain] = useState(null);

    useEffect(() => {
        setClient(new APIClient({
            onConnectionsChanged: (newState) => {
                console.log("connections: ", connections);
                setConnections(newState);
            },
            onChainChanged: (chainState) => {
                console.log("chainState: ", chainState);
                setChain(chainState);
            },
            onOpen: () => {
                setConnected(true);
            },
            onClose: () => {
                setConnected(false);
            }
        }));
        return () => {
            if (client)
                client.closeConnection();
        }
    }, []);

    if (connected && chain) {
        return (
            <div className='flex flexcol'>
                <Sidebar connections={connections} chain={chain} />

                <div className="relative top-0 left-50 bg-white w-3/4 h-full border-r">
                    <div className="p-10">
                        <Routes>
                            <Route path="/" element={<Overview connections={connections} chain={chain} />} />
                            <Route path="/overview" element={<Overview connections={connections} chain={chain} />} />
                            <Route path="/chain" element={<Chain client={client} chain={chain}/>} />
                            <Route path="/peers" element={<Peers client={client} connections={connections} />} />
                        </Routes>
                    </div>
                </div>
            </div >
        )
    } else {
        return (
            < div >
                Not connected
            </div>
        );

    }
}

export default App
