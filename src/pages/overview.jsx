
function Overview({chain, connections}) {
    return (
        <div>
            <h1 className="my-4 text-4xl font-extrabold leading-none tracking-tight text-gray-800 md:text-5xl lg:text-6xl">Overview</h1>
            <div className="flex">
                <div className="p-3 max-w-64 border border-gray-200 rounded">
                    <div className="flex justify-center">
                        <span className="text-xs text-center text-gray-500">
                            Chain
                        </span>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                            <tr>
                                <th scope="col" className="px-3 py-1 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Length</th>
                                <td className="px-3 py-1 text-sm text-end text-gray-800 dark:text-neutral-200 lowercase whitespace-pre">{chain.head.height}</td>
                            </tr>
                            <tr>
                                <th scope="col" className="px-3 py-1 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Total Work</th>
                                <td className="px-3 py-1 whitespace-nowrap text-sm text-end text-gray-800 dark:text-neutral-200">{chain.head.worksum}</td>
                            </tr>
                            <tr>
                                <th scope="col" className="px-3 py-1 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Difficulty</th>
                                <td className="px-3 py-1 whitespace-nowrap text-sm text-end text-gray-800 dark:text-neutral-200">{chain.head.difficulty}</td>
                            </tr>
                            <tr>
                                <th scope="col" className="px-3 py-1 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Hashrate</th>
                                <td className="px-3 py-1 whitespace-nowrap text-sm text-end text-gray-800 dark:text-neutral-200">1</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="p-3 max-w-64 border border-gray-200 rounded">
                    <div className="flex justify-center">
                        <span className="text-xs text-center text-gray-500">
                            Peers
                        </span>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                            <tr>
                                <th scope="col" className="px-3 py-1 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Pinned</th>
                                <td className="px-3 py-1 text-sm text-end text-gray-800 dark:text-neutral-200 lowercase whitespace-pre">20</td>
                            </tr>
                            <tr>
                                <th scope="col" className="px-3 py-1 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Outbound</th>
                                <td className="px-3 py-1 text-sm text-end text-gray-800 dark:text-neutral-200 lowercase whitespace-pre">20</td>
                            </tr>
                            <tr>
                                <th scope="col" className="px-3 py-1 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Inbound</th>
                                <td className="px-3 py-1 whitespace-nowrap text-sm text-end text-gray-800 dark:text-neutral-200">0</td>
                            </tr>
                            <tr>
                                <th scope="col" className="px-3 py-1 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Banned</th>
                                <td className="px-3 py-1 whitespace-nowrap text-sm text-end text-gray-800 dark:text-neutral-200">5</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Overview
