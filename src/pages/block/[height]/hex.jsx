// src/pages/block/[height]/hex.jsx
import { useParams, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

export default function BlockHexView({ client }) {
  const { height } = useParams();
  const containerRef = useRef(null);
  const breadcrumbsRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadBinary() {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch from real API
        const response = await client.get(`/chain/block/${height}/binary`);

        // 2. Extract { bytes, structure } from response.data
        const apiData = response?.data;
        if (!apiData?.bytes || !Array.isArray(apiData.structure)) {
          throw new Error('Invalid response: missing bytes or structure in data');
        }

        process_tree(apiData); // ← pass { bytes, structure }
      } catch (err) {
        console.error('Failed to load block binary:', err);
        setError(err.message || 'Failed to load binary data');
      } finally {
        setLoading(false);
      }
    }

    // ——————————————————————————————————————————————
    // Hover-breadcrumb logic (unchanged)
    // ——————————————————————————————————————————————
    function process_child(hex, parentNode, child, childIndex) {
      const span = document.createElement('span');
      parentNode.appendChild(span);
      span.begin = child.offsetBegin;
      span.end = child.offsetEnd;
      span.tag = child.tag;
      span.index = childIndex;

      if (child.children.length === 0) {
        span.textContent = hex.substring(2 * child.offsetBegin, 2 * child.offsetEnd);
        span.classList.add('leaf');

        span.addEventListener('mouseover', (e) => {
          const target = e.target;
          const list = [];
          let cur = target;
          while (cur && cur.getAttribute && cur.getAttribute('tag') !== 'block') {
            list.unshift(`${cur.tag}[${cur.begin}:${cur.end}]`);
            cur = cur.parentElement;
          }
          if (breadcrumbsRef.current) {
            breadcrumbsRef.current.textContent = list.join(' > ');
          }
        });
      } else {
        process_children(hex, span, child.children);
      }
    }

    function process_children(hex, parentNode, children) {
      let cursor = parentNode.begin;
      let i = 0;
      for (const child of children) {
        const begin = child.offsetBegin;
        if (begin > cursor) {
          process_child(
            hex,
            parentNode,
            { offsetBegin: cursor, offsetEnd: begin, tag: 'unknown', children: [] },
            i++
          );
        }
        process_child(hex, parentNode, child, i++);
        cursor = child.offsetEnd;
      }
      if (cursor < parentNode.end) {
        process_child(
          hex,
          parentNode,
          { offsetBegin: cursor, offsetEnd: parentNode.end, tag: 'unknown', children: [] },
          i++
        );
      }
    }

    function process_tree({ bytes, structure }) {
      const container = containerRef.current;
      if (!container) return;

      container.innerHTML = '';
      const hex = bytes;
      container.begin = 0;
      container.end = hex.length / 2;
      container.setAttribute('tag', 'block');

      process_children(hex, container, structure);
    }

    loadBinary();
  }, [height, client]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Block {height} – Raw Binary View
      </h1>

      <div
        ref={breadcrumbsRef}
        className="mb-4 text-sm font-mono text-gray-600 dark:text-gray-400 min-h-[1.5em]"
      />

      {loading && <p className="text-gray-600">Loading binary data...</p>}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      <code
        ref={containerRef}
        className="block w-full overflow-x-auto font-mono text-xs bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700"
        style={{ whiteSpace: 'pre' }}
      />

      <Link
        to={`/chain/block/${height}`}
        className="mt-6 inline-block text-sm text-blue-600 hover:underline"
      >
        Back to Block Details
      </Link>

      <style>
        {`.leaf:hover { background: yellow !important; outline: 1px solid black; }`}
      </style>
    </div>
  );
}