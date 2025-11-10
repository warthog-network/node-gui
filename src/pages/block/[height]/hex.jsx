// src/pages/block/[height]/hex.jsx
import { useParams, Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function BlockHexView({ client, chain }) {
  const { height } = useParams();               // <-- dynamic segment
  const containerRef = useRef(null);
  const breadcrumbsRef = useRef(null);

  // -----------------------------------------------------------------
  // Load the JSON once per mount (or when height changes)
  // -----------------------------------------------------------------
  useEffect(() => {
    async function loadHex() {
      try {
        const resp = await fetch('/block-binary.json');
        if (!resp.ok) throw new Error('Failed to load block-binary.json');
        const { data } = await resp.json();
        process_tree(data);
      } catch (err) {
        console.error(err);
        if (containerRef.current) {
          containerRef.current.textContent = 'Error loading binary data.';
        }
      }
    }

    // -----------------------------------------------------------------
    // All functions copied verbatim from your co-dev’s instructions
    // -----------------------------------------------------------------
    function process_child(hex, parentNode, child, childIndex) {
      const span = document.createElement('span');
      parentNode.appendChild(span);
      span.begin = child.offsetBegin;
      span.end = child.offsetEnd;
      span.tag = child.tag;
      span.index = childIndex;

      const children = child.children;
      if (children.length === 0) {
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
        process_children(hex, span, children);
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

    loadHex();
  }, [height]); // re-run if the block height ever changes

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Block {height} – Raw Hex View
      </h1>

      {/* Breadcrumb navigation */}
      <div
        ref={breadcrumbsRef}
        className="mb-4 text-sm font-mono text-gray-600 dark:text-gray-400 min-h-[1.5em]"
      />

      {/* Hex dump */}
      <code
        ref={containerRef}
        className="block w-full overflow-x-auto font-mono text-xs bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700"
        style={{ whiteSpace: 'pre' }}
      />

      {/* Back link */}
 <Link
  to={`/chain/block/${height}`}
  className="mt-6 inline-block text-sm text-blue-600 hover:underline"
>
  Back to Block Details
</Link>

      {/* Hover style for leaf nodes */}
      <style jsx>{`
        .leaf:hover {
          background: yellow !important;
          outline: 1px solid black;
        }
      `}</style>
    </div>
  );
}