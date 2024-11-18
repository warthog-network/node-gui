import { format_timestamp, loglevel_symbol } from '@/util.js'
import { H1 } from '../components/misc.jsx'
import { useEffect, useState, useRef } from 'react'
function Logs({ log }) {
    var [autoscroll, setAutoscroll] = useState(true)

    const scrollableRef = useRef(null);

    useEffect(() => {
        if (scrollableRef.current && autoscroll) {
            scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
        }
    });

    const onScrolled = () => {
        if (scrollableRef.current) {
            const c = scrollableRef.current;
            const autoscrollState = (c.scrollTop + c.clientHeight >= c.scrollHeight);
            setAutoscroll(autoscrollState);
        }
    }

    return (
        <div className="flex flex-col h-full">
            <H1>Logs</H1>
            <h2 className="mb-2 text-2xl font-semibold leading-none tracking-tight text-gray-800 md:text-3xl lg:text-4xl">Latest logs</h2>
            <div className="text-left h-full overflow-y-scroll px-2  bg-black text-white" onScroll = {onScrolled} ref={scrollableRef}>
                {
                    log.lines.map((line, index) => {
                        return (
                            <p key={index}> {line.datetime} {loglevel_symbol(line.level)} {line.message}</p>
                        );
                    })

                }
            </div>
        </div >
    )
}

export default Logs
