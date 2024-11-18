import { useMemo, useEffect, useState } from 'react'
import { H1 } from '../components/misc.jsx'
function Info({ client }) {
    var [info, setInfo] = useState(null)
    useEffect(
        () => {
            let mounted = true
            client.get('/tools/info').then(
                ({ data }) => {
                    if (mounted)
                        setInfo(data);
                },
                (err) => { console.error(err) }
            );
            return () => {mounted = false}
        },[]
    )
    if (info) {
        return (
            <div className=''>
                <H1>Info</H1>
            <p> Node version: {info.version.name} </p>
            <p> Uptime: {info.uptime.formatted} </p>
            <p> Chain DB size: {info.dbSize} </p>
            <p> Chain DB path: {info.chainDBPath} </p>
            <p> Peers DB path: {info.peersDBPath} </p>
            </div >
        );
    } else {
        return (
            <div className=''>
                <H1>Info</H1>
                loading...
            </div >
        );
    }
}

export default Info
