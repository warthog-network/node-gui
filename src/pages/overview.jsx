import { useEffect, useState } from 'react'
import { format_hash, H1 } from '../components/misc.jsx'

const LOGO_SRC = 'https://pbs.twimg.com/profile_images/1739991331252879360/HM1JGzf8.jpg';

function Overview({ chain, connections, client }) {
    const [banned, setBanned] = useState(0);
    const [pinned, setPinned] = useState(20); // Fallback to hardcoded default
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        const fetchData = async () => {
            try {
                const bannedRes = await client.get('/peers/banned').catch(err => {
                    console.error('Banned fetch error:', err);
                    return null;
                });
                const endpointsRes = await client.get('/peers/endpoints').catch(err => {
                    console.error('Endpoints fetch error:', err);
                    return null;
                });

                if (mounted) {
                    if (bannedRes && bannedRes.data && bannedRes.data.data) {
                        setBanned(bannedRes.data.data.length || 0);
                    }
                    if (endpointsRes && endpointsRes.data && endpointsRes.data.data) {
                        setPinned(endpointsRes.data.data.length || 20);
                    }
                }
            } catch (err) {
                if (mounted) {
                    console.error('General fetch error:', err);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();

        return () => { mounted = false; };
    }, [client]);

    // Assuming default listen ports for outbound connections
    const defaultPorts = [9186, 19110];
    const outbound = connections.filter(c => defaultPorts.includes(c.connection?.port)).length;
    const inbound = connections.length - outbound;

    // Hashrate is now part of chain state (fetched on chain updates via WS events)
    const hashrate = chain.hashrate;

    if (loading) {
        return <H1>Overview (Loading...)</H1>;
    }

    return (
        <div className="p-6 container min-h-screen relative overflow-hidden">
            <H1 className="text-center mb-8 text-4xl font-bold text-gray-800 dark:text-white relative z-10">Overview</H1>
            <div className="relative mx-auto w-[400px] h-[400px] max-w-full aspect-square mt-20">
                <div className="absolute inset-0 animate-rotate-slow">
                    <div className="absolute top-0 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2">
                        <div className="relative w-full h-full rounded-full shadow-2xl overflow-hidden bg-white dark:bg-gray-800 animate-counter-rotate hover:scale-105 transition-transform duration-300">
                            <img 
                                src={LOGO_SRC} 
                                alt="Warthog Network Logo" 
                                className="absolute inset-0 w-full h-full object-cover opacity-5"
                            />
                            <div className="relative z-10 flex flex-col justify-center items-center h-full p-6">
                                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Chain</h2>
                                <dl className="space-y-2 text-center">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Length</dt>
                                        <dd className="text-sm text-gray-900 dark:text-white">{chain.head.height}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Work</dt>
                                        <dd className="text-sm text-gray-900 dark:text-white">{format_hash(chain.head.worksum)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Difficulty</dt>
                                        <dd className="text-sm text-gray-900 dark:text-white">{format_hash(chain.head.difficulty)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Hashrate</dt>
                                        <dd className="text-sm text-gray-900 dark:text-white">{hashrate ? `${format_hash(hashrate)}/s` : 'N/A'}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-1/2 w-64 h-64 -translate-x-1/2 translate-y-1/2">
                        <div className="relative w-full h-full rounded-full shadow-2xl overflow-hidden bg-white dark:bg-gray-800 animate-counter-rotate hover:scale-105 transition-transform duration-300">
                            <img 
                                src={LOGO_SRC} 
                                alt="Warthog Network Logo" 
                                className="absolute inset-0 w-full h-full object-cover opacity-5"
                            />
                            <div className="relative z-10 flex flex-col justify-center items-center h-full p-6">
                                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Peers</h2>
                                <dl className="space-y-2 text-center">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Pinned</dt>
                                        <dd className="text-sm text-gray-900 dark:text-white">{pinned}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Outbound</dt>
                                        <dd className="text-sm text-gray-900 dark:text-white">{outbound}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Inbound</dt>
                                        <dd className="text-sm text-gray-900 dark:text-white">{inbound}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Banned</dt>
                                        <dd className="text-sm text-gray-900 dark:text-white">{banned}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes rotate-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .animate-rotate-slow {
                    animation: rotate-slow 30s linear infinite;
                }
                @keyframes counter-rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(-360deg); }
                }
                .animate-counter-rotate {
                    animation: counter-rotate 30s linear infinite;
                }
            `}</style>
        </div>
    );
}

export default Overview