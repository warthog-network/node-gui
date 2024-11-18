import { H1 } from '../components/misc.jsx'
function Peers({ client, connections }) {
    return (
        <div className="flex flex-col h-full">
            <H1>Peers</H1>
            <div className="text-left h-full overflow-y-scroll px-2">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                    <thead>
                        <tr>
                            <th scope="col" className="px-3 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Inbound</th>
                            <th scope="col" className="px-3 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Address</th>
                            <th scope="col" className="px-3 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Duration</th>
                            <th scope="col" className="px-3 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                        {
                            connections.map((connection) => (
                                <tr key={connection.id}>
                                    <td className="p-1 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{connection.inbound ? 'YES' : 'NO'}</td>
                                    <td className="p-1 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{connection.peerAddr}</td>
                                    <td className="p-1 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{connection.since}</td>
                                    <td className="p-1 whitespace-nowrap text-end text-sm font-medium">
                                        <button onClick={() => { client.disconnect(connection.id); }} type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400">Disconnect</button>
                                    </td>
                                </tr>

                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Peers
