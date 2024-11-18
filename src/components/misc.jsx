import React from 'react';

export function H1({ children }) {
    return (
        <h1 className="text-center py-4 text-4xl font-extrabold leading-none tracking-tight text-gray-800 md:text-5xl lg:text-6xl">{children}</h1>
    );
}
export function format_hash(n) {
    if (n < 1000)
        return n.toFixed(2) + " h";
    n/=1000
    if (n < 1000)
        return n.toFixed(2) + " kh";
    n/=1000
    if (n < 1000)
        return n.toFixed(2) + " Mh";
    n/=1000
    if (n < 1000)
        return n.toFixed(2) + " Gh";
    n/=1000
    if (n < 1000)
        return n.toFixed(2) + " Th";
    n/=1000
    if (n < 1000)
        return n.toFixed(2) + " Ph";
    n/=1000
    if (n < 1000)
        return n.toFixed(2) + " Eh";
    n/=1000
    return n.toFixed(2) + " Zh";
}
