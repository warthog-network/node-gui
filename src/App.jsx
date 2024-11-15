import { useMemo, useEffect, useState } from 'react'
import Sidebar from './Sidebar.jsx'
import { Routes, Route } from 'react-router-dom';
import Overview from './pages/overview.jsx'
import Peers from './pages/peers.jsx'
import Chain from './pages/chain.jsx'
import Logs from './pages/logs.jsx'
import Info from './pages/info.jsx'
import APIClient from './assets/api_ws.js'
import './App.css'

import React from 'react';


function App() {
    const [client, setClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [connections, setConnections] = useState([]);
    const [loglines, setLog] = useState([]);
    const [chain, setChain] = useState(null);

    useEffect(() => {
        var client = new APIClient({
            onLogChanged: (newState) => {
                setLog(newState);
                console.log("log changed: ", newState);
                console.log("loglines: ", loglines);
            },
            onConnectionsChanged: (newState) => {
                setConnections(newState);
                console.log("connections: ", connections);
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
        });

        setClient(client);
        return () => {
            console.log("cleanup", client)
            if (client){
                client.closeConnection();
            }
        }
    }, []);

    if (connected && chain) {
        return (
            <div className="inline">
                <Sidebar connections={connections} chain={chain} />

                <div className="top-0 ml-52 bg-yellow-50">
                    <div className=" p-5">
                        <Routes>
                            <Route path="/" element={<Overview connections={connections} chain={chain} />} />
                            <Route path="/overview" element={<Overview connections={connections} chain={chain} />} />
                            <Route path="/chain" element={<Chain client={client} chain={chain}/>} />
                            <Route path="/peers" element={<Peers client={client} connections={connections} />} />
                            <Route path="/logs" element={<Logs loglines={loglines} />} />
                            <Route path="/info" element={<Info client={client} />} />
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
