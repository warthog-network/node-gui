import { useState, useEffect } from 'react';
import ChartComponent from '@/components/ChartComponent.jsx';
import { H1 } from '@/components/misc.jsx';
import { format_height, abbreviate } from '@/util.js';
import { Block } from '@/assets/api_ws.js';  // Updated path if needed; was '@/assets/api_ws.js' but assuming standard src/api_ws.js

function Explorer({ client, chain }) {
    const [mode, setMode] = useState('latest'); // 'latest' or 'all'
    const [page, setPage] = useState(1);
    const [currentBlocks, setCurrentBlocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState(''); // New state for search bar input
    const [isSearching, setIsSearching] = useState(false); // Flag to indicate if in search mode
    const perPage = 10; // Adjust based on desired blocks per page; assuming similar to initial chain.blocks length

    useEffect(() => {
        if (mode === 'latest') {
            setCurrentBlocks(chain.blocks || []);
            setIsSearching(false); // Reset search mode in latest
            return;
        }

        if (isSearching) return; // Skip pagination fetch if in search mode

        setLoading(true);
        async function loadBlocks() {
            const tipHeight = chain.blocks[chain.blocks.length - 1]?.height || 0;
            const startHeight = tipHeight - (page - 1) * perPage;
            if (startHeight < 1) {  // Adjusted to prevent fetching invalid heights below 1
                setPage(1);
                return;
            }
            const endHeight = Math.max(startHeight - perPage + 1, 1);  // Ensure we don't go below height 1
            const promises = [];
            for (let h = startHeight; h >= endHeight; h--) {
                const existing = chain.blocks.find(b => b.height === h);
                if (existing) {
                    promises.push(Promise.resolve(existing));
                } else {
                    promises.push(client.getBlock(h));
                }
            }
            try {
                const results = await Promise.allSettled(promises);
                const blocks = results
                    .filter(result => result.status === 'fulfilled')
                    .map(result => result.value);
                setCurrentBlocks(blocks.map(b => b instanceof Block ? b : new Block(b)));
            } catch (error) {
                console.error('Error fetching blocks:', error);
                setCurrentBlocks([]);
            } finally {
                setLoading(false);
            }
        }
        loadBlocks();
    }, [mode, page, chain, client, isSearching]);

    const toggleMode = () => {
        setMode(mode === 'latest' ? 'all' : 'latest');
        setPage(1);
        setIsSearching(false); // Reset search on mode toggle
        setSearchInput('');
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchInput.trim()) return; // Skip empty search
        setLoading(true);
        setIsSearching(true); // Enter search mode (disables pagination)
        const heights = parseSearchInput(searchInput);
        const promises = heights.map(h => {
            const existing = chain.blocks.find(b => b.height === h);
            return existing ? Promise.resolve(existing) : client.getBlock(h);
        });
        try {
            const results = await Promise.allSettled(promises);
            const blocks = results
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value);
            setCurrentBlocks(blocks.map(b => b instanceof Block ? b : new Block(b)).sort((a, b) => b.height - a.height)); // Sort descending by height
        } catch (error) {
            console.error('Error searching blocks:', error);
            setCurrentBlocks([]);
        } finally {
            setLoading(false);
        }
    };

    const parseSearchInput = (input) => {
        const heights = new Set(); // Use set to avoid duplicates
        const parts = input.split(/\s+/).map(p => p.trim()).filter(p => p); // Split on whitespace
        parts.forEach(part => {
            if (part.includes('-')) {
                const [startStr, endStr] = part.split('-');
                const start = Number(startStr.replace(/,/g, ''));
                const end = Number(endStr.replace(/,/g, ''));
                if (!isNaN(start) && !isNaN(end) && start <= end) {
                    for (let h = start; h <= end; h++) {
                        heights.add(h);
                    }
                }
            } else {
                const h = Number(part.replace(/,/g, ''));
                if (!isNaN(h)) {
                    heights.add(h);
                }
            }
        });
        return Array.from(heights);
    };

    const resetSearch = () => {
        setSearchInput('');
        setIsSearching(false);
        // Trigger reload of current page
    };

    const tipHeight = chain.blocks[chain.blocks.length - 1]?.height || 0;
    const maxPage = Math.ceil(tipHeight / perPage);  // Adjusted to assume heights start from 1, total blocks = tipHeight
    const hasNext = page < maxPage;

    return (
        <div className="container mx-auto px-4 py-8">
            <H1>Explorer</H1>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
                    {mode === 'latest' ? 'Latest Blocks' : `Blocks (Page ${page})`}
                </h2>
                <button
                    onClick={toggleMode}
                    className="px-4 py-2 text-sm font-medium text-white bg-zinc-700 rounded-lg hover:bg-zinc-800 focus:ring-4 focus:outline-none focus:ring-zinc-300 transition-colors duration-200 dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:focus:ring-zinc-800"
                >
                    {mode === 'latest' ? 'Switch to Deep Search (All Blocks)' : 'Switch to Latest Blocks'}
                </button>
            </div>
            {mode === 'all' && (
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search blocks: 123 100-200 or 1 3 5"
                            className="flex-grow px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-l-lg focus:ring-zinc-500 focus:border-zinc-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-zinc-500"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-zinc-700 rounded-r-lg hover:bg-zinc-800 focus:ring-4 focus:outline-none focus:ring-zinc-300 transition-colors duration-200 dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:focus:ring-zinc-800"
                        >
                            Search
                        </button>
                        {isSearching && (
                            <button
                                type="button"
                                onClick={resetSearch}
                                className="ml-2 px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                </form>
            )}
            {loading ? (
                <p className="text-gray-600">Loading blocks...</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {currentBlocks.map((block) => (
                            <div
                                key={block.header.hash}
                                className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700"
                            >
                                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                    <span className="px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-full">Block {format_height(block.height)}</span>
                                    <span className="text-sm text-gray-500">5s ago</span>
                                </div>
                                <div className="px-4 py-3">
                                    <dl className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <dt className="font-medium text-gray-500 uppercase">Hash</dt>
                                            <dd className="text-gray-800 dark:text-neutral-200 lowercase">{abbreviate(block.header.hash)}</dd>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <dt className="font-medium text-gray-500 uppercase">Miner</dt>
                                            <dd className="text-gray-800 dark:text-neutral-200">{abbreviate(block.miner())}</dd>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <dt className="font-medium text-gray-500 uppercase">Reward</dt>
                                            <dd className="text-gray-800 dark:text-neutral-200">{block.reward()}</dd>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <dt className="font-medium text-gray-500 uppercase">#TXS</dt>
                                            <dd className="text-gray-800 dark:text-neutral-200">{block.transactionCount()}</dd>
                                        </div>
                                    </dl>
                                </div>
                                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                                    <a
                                        href={`/chain/block/${block.height}`}
                                        className="inline-flex items-center w-full justify-center px-4 py-2 text-sm font-medium text-white bg-zinc-700 rounded-lg hover:bg-zinc-800 focus:ring-4 focus:outline-none focus:ring-zinc-300 transition-colors duration-200 dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:focus:ring-zinc-800"
                                    >
                                        Details
                                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                    {!loading && currentBlocks.length === 0 && (
                        <p className="text-gray-600 col-span-full text-center py-4">No blocks found for this page. The chain may be short or historical data unavailable.</p>
                    )}
                </>
            )}
            {mode === 'all' && !loading && !isSearching && (
                <div className="flex justify-between items-center mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">Page {page} of {maxPage}</span>
                    <button
                        disabled={!hasNext}
                        onClick={() => setPage(page + 1)}
                        className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        Next
                    </button>
                </div>
            )}
            <h2 className="mt-8 mb-4 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl lg:text-4xl">Hashrate Chart</h2>
            <ChartComponent client={client} />
        </div>
    );
}

export default Explorer;