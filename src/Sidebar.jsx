import { Link } from 'react-router-dom';
import { format_height } from './util.js'

function Sidebar({ chain, connections }) {
    return (
        <div className="z-50 fixed w-52 flex flex-col top-0 left-0 bg-black text-gray-800 h-full border-r">
            <div className=" items-center justify-center h-14 border-b border-zinc-600">
            </div>
            <div className="overflow-y-auto overflow-x-hidden flex-grow bg-zinc-900 text-gray-500 ">
                <ul className="flex flex-col py-4 space-y-1">
                    <li><Link to="/overview">
                        <span href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-zinc-100 hover:text-gray-800 border-l-4 border-transparent hover:border-yellow-500 pr-6">
                            <span className="inline-flex justify-center items-center ml-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                            </span>
                            <span className="mx-2 text-sm tracking-wide truncate">Overview</span>
                        </span>
                    </Link></li>
                    <li><Link to="/chain">
                        <span href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-zinc-200 hover:text-gray-800 border-l-4 border-transparent hover:border-yellow-500 pr-6">
                            <span className="inline-flex justify-center items-center ml-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" d="m-1,13v1h5v-1m-5,-2v-1h5v1m13.5,2v1h5v-3m-5,0v-1h5v1m-10,1h6m-10,1v1h5v-1m-5,-2v-1h5v1m-10,1h6"></path></svg>
                            </span>
                            <span className="mx-2 text-sm tracking-wide truncate">Chain</span>
                            <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-yellow-600 bg-yellow-100 rounded-full">{format_height(chain.head.height)}</span>
                        </span>
                    </Link></li>
                    <li><Link to="/explorer">
                        <span href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-zinc-200 hover:text-gray-800 border-l-4 border-transparent hover:border-yellow-500 pr-6">
                            <span className="inline-flex justify-center items-center ml-4">
                                <svg className="w-5 h-5" fill="currentColor" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="2" style={{ fill: 'none' }} /><path d="m14 15 6 6.5362" fill="none" stroke="currentColor" strokeWidth="3" style={{ fontVariationSettings: 'normal' }} />
                                </svg>
                            </span>
                            <span className="mx-2 text-sm tracking-wide truncate">Explorer</span>
                        </span>
                    </Link></li>
                    <li><Link to="/peers">
                        <span href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-zinc-200 hover:text-gray-800 border-l-4 border-transparent hover:border-yellow-500 pr-6">
                            <span className="flex justify-center items-center ml-4">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="2.9912" style={{ stroke: 'none' }} /><circle cx="12" cy="22" r="2" style={{ stroke: 'none' }} /><circle cx="22" cy="2" r="2" style={{ stroke: 'none' }} /><circle cx="22" cy="22" r="2" style={{ stroke: 'none' }} /><circle cx="2" cy="22" r="2" style={{ stroke: 'none' }} /><circle cx="2" cy="12" r="2" style={{ stroke: 'none' }} /><circle cx="2" cy="2" r="2" style={{ stroke: 'none' }} /><circle cx="12" cy="2" r="2" style={{ stroke: 'none' }} /><circle cx="22" cy="12" r="2" style={{ stroke: 'none' }} /><path d="m12 16v2.9064m3-9.9064 5-5m-16 16 5-5m5.9912 0.20261 5.0088 4.7974m-4.032-8h3.032m-7-6.9064v2.9064m-8-4 5 5m-4.0924 3h3.0924" fill="none" strokeWidth="2" /></svg>
                            </span>
                            <span className="mx-2 text-sm tracking-wide truncate">Peers</span>
                            <span className=" px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-yellow-600 bg-yellow-100 rounded-full">{connections.length}</span>
                        </span>
                    </Link></li>
                    <li><Link to="/wallet">
                        <span href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-zinc-200 hover:text-gray-800 border-l-4 border-transparent hover:border-yellow-500 pr-6">
                            <span className="flex justify-center items-center ml-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" d="M 3,9 V 8 L 17.059715,4.4850713 A 1.5615528,1.5615528 0 0 1 19,6 V 8.4090023 M 2,19 h 18 a 1,1 0 0 0 1,-1 V 10 A 1,1 0 0 0 20,9 H 3 V 19 M 10,9 c 0,-1.25043 0.6671,-2.40587 1.75,-3.03109 1.0829,-0.62521 2.4171,-0.62521 3.5,0 C 16.3329,6.59413 17,7.74957 17,9 h -3.5 z"></path></svg>
                            </span>
                            <span className="mx-2 text-sm tracking-wide truncate">Wallet</span>
                            <span className=" px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-yellow-600">Soon</span>
                        </span>
                    </Link></li>
                    <li><Link to="/defi2">
                        <span href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-zinc-200 hover:text-gray-800 border-l-4 border-transparent hover:border-yellow-500 pr-6">
                            <span className="flex justify-center items-center ml-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" d="m 3.5,13.553832 6,-9 4,5.892336 7,-8.892336 M 6,19.796446 4,18.203554 6,16.796446 M 18,18.397852 5,18.352932 M 18,20 20,21.592892 18,23 m -12,-1.601406 13,0.04492"></path></svg>
                            </span>
                            <span className="mx-2 text-sm tracking-wide truncate">DeFi 2.0</span>
                            <span className=" px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-yellow-600 ">Soon</span>
                        </span>
                    </Link></li>
                    <li><Link to="/health">
                        <span href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-zinc-200 hover:text-gray-800 border-l-4 border-transparent hover:border-yellow-500 pr-6">
                            <span className="inline-flex justify-center items-center ml-4">
                                <svg className="w-5 h-5" fill="currentColor" version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" d="M 8,15.5147 C 10,22 15,20.540792 17,18 c 2,-2.486672 2,-6.348405 2,-8.97014 m -15,-5 V 12 c 0,1.6733 1.35651,3.0299 3.02986,3.0299 H 9.47138 C 10.8679,15.0299 12,13.8978 12,12.5012 V 4.02986" strokeWidth="2" /><g fillRule="evenodd"><circle cx="19" cy="8.03" r="3" style={{ stroke: 'none' }} /><circle cx="5" cy="4.37" r="2" style={{ stroke: 'none' }} /><circle cx="11" cy="4.37" r="2" style={{ stroke: 'none' }} /></g></svg>

                            </span>
                            <span className="mx-2 text-sm tracking-wide truncate">Health Check</span>
                            <span className=" px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-600 bg-red-200 rounded-full">!</span>
                        </span>
                    </Link></li>
                    <li><Link to="/logs">
                        <span href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-zinc-200 hover:text-gray-800 border-l-4 border-transparent hover:border-yellow-500 pr-6">
                            <span className="inline-flex justify-center items-center ml-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                            </span>
                            <span className="mx-2 text-sm tracking-wide truncate">Logs</span>
                        </span>
                    </Link></li>
                    <li><Link to="/info">
                        <span href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-zinc-200 hover:text-gray-800 border-l-4 border-transparent hover:border-yellow-500 pr-6">
                            <span className="inline-flex justify-center items-center ml-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m 12,7 v 0 m 0,10 v -7 m 9,2 c 0,4.970563 -4.029437,9 -9,9 -4.9705627,0 -9,-4.029437 -9,-9 0,-4.9705627 4.0294373,-9 9,-9 4.970563,0 9,4.0294373 9,9 z"></path></svg>
                            </span>
                            <span className="mx-2 text-sm tracking-wide truncate">Info</span>
                        </span>
                    </Link></li>
                </ul>

            </div>
            <div className="h-max">
            </div>
            <span className="border-t border-zinc-600 text-gray-500 flex flex-row items-center text-center h-11 focus:outline-none  hover:text-gray-800 border-transparent">
                <svg className="rounded-full bg-lime-400   w-2 h-2" viewBox="0 0 2 2" xmlns="http://www.w3.org/2000/svg">
                </svg>
                <span className="mx-2 text-sm tracking-wide truncate">Connected</span>
            </span>
        </div>
        // <div className="min-h-screen flex flex-shrink-0  bg-zinc-200 ">
        // </div>
    )
}

export default Sidebar
