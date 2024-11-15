import {format_timestamp, loglevel_symbol} from '@/util.js'
import { H1 } from '../components/misc.jsx'
function Logs({ loglines }) {
    {
        console.log("Logs", loglines);
    }
    return (
        <div className=''>
        <H1>Logs</H1>
            <h2 className="mb-2 text-2xl font-semibold leading-none tracking-tight text-gray-800 md:text-3xl lg:text-4xl">Latest logs</h2>
            <div className="text-left bg-black text-white">
                {
                    loglines.map((line, index) => {
                        return (
                        <p key={index}> {line.datetime} {loglevel_symbol(line.level)} {line.message}</p>
                    );})

                }
            </div>
        </div >
    )
}

export default Logs
