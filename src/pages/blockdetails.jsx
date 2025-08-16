import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { H1 } from '@/components/misc.jsx';
import { format_height, abbreviate } from '@/util.js';
import { Block } from '@/assets/api_ws.js';  // Assuming the import path is correct

function TransactionItem({ tx, index }) {
  const isRewardTx = !tx.fromAddress; // Rewards lack fromAddress; transfers have it
  return (
    <li key={tx.txHash || `tx-${index}`} className="bg-gray-50 p-3 rounded-lg dark:bg-gray-700">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-800 dark:text-neutral-200 break-all">
          {isRewardTx ? `Miner Reward - ${abbreviate(tx.txHash)}` : abbreviate(tx.txHash)}
        </span>
        {tx.txHash && (
          <a
            href={`/transaction/lookup/${tx.txHash}`}
            className="text-sm text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            View Details
          </a>
        )}
      </div>
      {tx.fromAddress && (
        <div className="mt-1 text-xs text-gray-600 dark:text-neutral-400">
          From: {abbreviate(tx.fromAddress)}
        </div>
      )}
      {tx.toAddress && (
        <div className="mt-1 text-xs text-gray-600 dark:text-neutral-400">
          To: {abbreviate(tx.toAddress)}
        </div>
      )}
      {tx.amount && (
        <div className="mt-1 text-xs text-gray-600 dark:text-neutral-400">
          Amount: {tx.amount}
        </div>
      )}
      {tx.fee && (
        <div className="mt-1 text-xs text-gray-600 dark:text-neutral-400">
          Fee: {tx.fee}
        </div>
      )}
    </li>
  );
}

function BlockDetails({ client, chain }) {
  const params = useParams();
  const height = parseInt(params.height, 10);
  const [block, setBlock] = useState(chain.blocks.find(b => b.height === height));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!block) {
      setLoading(true);
      client.getBlock(height)
        .then(fetchedBlock => {
          setBlock(fetchedBlock instanceof Block ? fetchedBlock : new Block(fetchedBlock));
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    }
  }, [height, block, client]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <H1>Loading Block...</H1>
      </div>
    );
  }

  if (!block || error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <H1>Block Not Found</H1>
        <p className="text-gray-600">The requested block could not be found.</p>
        <a
          href="/explorer"
          className="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-200 transition-colors duration-200 dark:bg-gray-800 dark:text-zinc-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          ← Back to Explorer
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <H1>Block Details</H1>
      <h2 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
        Block {format_height(block.height)}
      </h2>
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="font-medium text-gray-500 uppercase">Hash</dt>
              <dd className="mt-1 text-gray-800 dark:text-neutral-200 lowercase break-all">{block.header?.hash ?? 'N/A'}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500 uppercase">Height</dt>
              <dd className="mt-1 text-gray-800 dark:text-neutral-200">{format_height(block.height)}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500 uppercase">Miner</dt>
              <dd className="mt-1 text-gray-800 dark:text-neutral-200 break-all">{block.miner()}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500 uppercase">Reward</dt>
              <dd className="mt-1 text-gray-800 dark:text-neutral-200">{block.reward()}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500 uppercase">Transaction Count</dt>
              <dd className="mt-1 text-gray-800 dark:text-neutral-200">{block.transactionCount()}</dd>
            </div>
            {block.header?.timestamp && (
              <div>
                <dt className="font-medium text-gray-500 uppercase">Timestamp</dt>
                <dd className="mt-1 text-gray-800 dark:text-neutral-200">{new Date(block.header.timestamp * 1000).toLocaleString()}</dd>
              </div>
            )}
          </dl>
        </div>
        <div className="px-6 py-4">
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">Transactions</h3>
          {block.transactions?.length > 0 ? (
            <ul className="space-y-3">
              {block.transactions.map((tx, index) => (
                <TransactionItem key={tx.txHash || `tx-${index}`} tx={tx} index={index} />
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-neutral-400">No transactions in this block.</p>
          )}
        </div>
      </div>
      <a
        href="/explorer"
        className="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-200 transition-colors duration-200 dark:bg-gray-800 dark:text-zinc-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
      >
        ← Back to Explorer
      </a>
    </div>
  );
}

export default BlockDetails;