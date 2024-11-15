import ChartComponent from '@/components/ChartComponent.jsx';
import {format_height,abbreviate} from '@/util.js'
function Chain({client, chain}) {
            console.log("blocks: ",chain.blocks);
    return (
        <div className=''>
            <h1 className="my-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">Chain</h1>
            <h2 className="mb-2 text-2xl font-semibold leading-none tracking-tight text-gray-800 md:text-3xl lg:text-4xl">Latest blocks</h2>
            <div className="flex flex-wrap">

        {
            chain.blocks.map((block)=>(

                <div key={block.header.hash} className="max-w-64 p-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="inline-flex justify-center w-full">
                        <span className="px-2 py-0.5 text-xs font-medium tracking-wide text-yellow-600 bg-yellow-100 rounded-full">Block {format_height(block.height)}</span>
                        <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-gray-500">5s ago</span>

                    </div>
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                            <tr>
                                <th scope="col" className="px-3 py-1 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Hash</th>
                                <td className="px-3 py-1 text-sm text-end text-gray-800 dark:text-neutral-200 lowercase whitespace-pre">{abbreviate(block.header.hash)}</td>
                            </tr>
                            <tr>
                                <th scope="col" className="px-3 py-1 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Miner</th>
                                <td className="px-3 py-1 whitespace-nowrap text-sm text-end text-gray-800 dark:text-neutral-200">{abbreviate(block.miner())}</td>
                            </tr>
                            <tr>
                                <th scope="col" className="px-3 py-1 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Reward</th>
                                <td className="px-3 py-1 whitespace-nowrap text-sm text-end text-gray-800 dark:text-neutral-200">{block.reward()}</td>
                            </tr>
                            <tr>
                                <th scope="col" className="px-3 py-1 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">#TXS</th>
                                <td className="px-3 py-1 whitespace-nowrap text-sm text-end text-gray-800 dark:text-neutral-200">{block.transactionCount()}</td>
                            </tr>
                        </tbody>
                    </table>
                    <a href="#" className="inline-flex items-center mt-3 px-3 py-2 text-sm font-medium text-center text-white bg-zinc-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Details
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                    </a>
                </div>
        ))
        }
            </div>
        <h1> Hashrate Chart</h1>
            <ChartComponent client={client} />
        </div >
    )
}

export default Chain
