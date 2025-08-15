import { useEffect, useState } from 'react';
import Sidebar from './Sidebar.jsx';
import { Routes, Route } from 'react-router-dom';
import Overview from './pages/overview.jsx';
import Peers from './pages/peers.jsx';
import Explorer from './pages/explorer.jsx';
import Logs from './pages/logs.jsx';
import BlockDetails from './pages/blockdetails.jsx';
import Info from './pages/info.jsx';
import APIClient from './assets/api_ws.js';
import Wallet from './pages/Wallet.jsx';
import './App.css';

import React from 'react';

var globalClient = new APIClient();

function App() {
    const [client, setClient] = useState(null);
    const [subscribed, setSubscribed] = useState(false);
    const [connections, setConnections] = useState([]);
    const [log, setLog] = useState([]);
    const [chain, setChain] = useState(null);

    useEffect(() => {
        globalClient.setters = {
            setConnections, setLog, setChain, setSubscribed
        };
        setClient(globalClient);
        return () => {
            console.log("cleanup", client);
            globalClient.onChange = null;
        };
    }, []);

    if (subscribed && chain) {
        return (
            <div className="inline">
                <Sidebar connections={connections} chain={chain} />

                <div className="top-0 ml-56 bg-yellow-50 h-dvh p-5">
                    <Routes>
                        <Route path="/" element={<Overview connections={connections} chain={chain} client={client} />} />
                        <Route path="/overview" element={<Overview connections={connections} chain={chain} client={client} />} />
                        <Route path="/explorer" element={<Explorer client={client} chain={chain} />} />
                        <Route path="/peers" element={<Peers client={client} connections={connections} />} />
                        <Route path="/logs" element={<Logs log={log} />} />
                        <Route path="/info" element={<Info client={client} />} />
                        <Route path="/wallet" element={<Wallet  />} /> {/* chain optional if needed for UI */}                        <Route path="/chain/block/:height" element={<BlockDetails client={client} chain={chain} />} />
                    </Routes>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                Not connected
            </div>
        );
    }
}

export default App;