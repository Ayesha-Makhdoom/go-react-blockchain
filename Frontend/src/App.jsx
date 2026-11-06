import { useEffect, useRef, useState } from 'react';
import { getInfo, getPending, getChain, addTransaction, mineBlock, searchBlockchain } from './api';
import './App.css';

function formatTimestamp(ns) {
  // Go sends UnixNano; JS Dates use milliseconds.
  return new Date(Number(ns) / 1e6).toLocaleString();
}

const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

function BlocksIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 2 3 7l9 5 9-5-9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function Highlight({ text, query }) {
  if (!query) return text;
  const parts = text.split(query);
  return parts.flatMap((part, i) =>
    i === 0 ? [part] : [<mark key={i}>{query}</mark>, part]
  );
}

function HashRow({ label, value }) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <code className="hash">{value}</code>
    </div>
  );
}

function BlockCard({ block, query, isLatest }) {
  const txs = block.transactions ?? [];
  const isGenesis = block.index === 0;

  return (
    <article className={`block-card ${query ? 'match' : ''}`}>
      <header className="block-header">
        <h3>Block #{block.index}</h3>
        <div className="badges">
          {isGenesis && <span className="badge badge-genesis">Genesis</span>}
          {isLatest && <span className="badge badge-latest">Latest</span>}
        </div>
      </header>

      <div className="block-meta">
        <div className="field">
          <span className="field-label">Height</span>
          <span>{block.index}</span>
        </div>
        <div className="field">
          <span className="field-label">Timestamp</span>
          <span>{formatTimestamp(block.timestamp)}</span>
        </div>
        <div className="field">
          <span className="field-label">Nonce</span>
          <span>{block.nonce.toLocaleString()}</span>
        </div>
      </div>

      <HashRow label="Hash" value={block.hash} />
      <HashRow label="Previous Hash" value={block.previous_hash} />
      <HashRow label="Merkle Root" value={block.merkle_root} />

      <div className="transactions">
        <span className="field-label">Transactions ({txs.length})</span>
        {txs.length === 0 ? (
          <p className="muted">No transactions in this block.</p>
        ) : (
          <ol>
            {txs.map((tx, i) => (
              <li key={i}>
                <Highlight text={tx.data} query={query} />
              </li>
            ))}
          </ol>
        )}
      </div>
    </article>
  );
}

export default function App() {
  const [chainName, setChainName] = useState('');
  const [chain, setChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [txInput, setTxInput] = useState('');
  const [pending, setPending] = useState([]);
  const [pendingOpen, setPendingOpen] = useState(false);
  const pendingRef = useRef(null);
  const [mining, setMining] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState(null);
  const [status, setStatus] = useState(null);

  async function refreshChain() {
    try {
      const [chainData, pendingData] = await Promise.all([getChain(), getPending()]);
      setChain(chainData);
      setPending(pendingData);
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getInfo()
      .then((info) => setChainName(info.name))
      .catch(() => {});
    refreshChain();
  }, []);

  useEffect(() => {
    if (!pendingOpen) return;
    function onPointerDown(e) {
      if (!pendingRef.current?.contains(e.target)) setPendingOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setPendingOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [pendingOpen]);

  useEffect(() => {
    document.title = chainName ? `${chainName} Blockchain` : 'Blockchain';
  }, [chainName]);

  async function handleAddTransaction(e) {
    e.preventDefault();
    const data = txInput.trim();
    if (!data) return;
    try {
      await addTransaction(data);
      setPending(await getPending());
      setTxInput('');
      setStatus({ type: 'success', text: `Transaction "${data}" added to the pool.` });
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    }
  }

  async function handleMine() {
    setMining(true);
    setStatus({ type: 'info', text: 'Running Proof of Work...' });
    try {
      const block = await mineBlock();
      setSearch(null);
      await refreshChain();
      setStatus({
        type: 'success',
        text: `Mined block #${block.index} with nonce ${block.nonce.toLocaleString()}.`,
      });
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    } finally {
      setMining(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) {
      setSearch(null);
      return;
    }
    try {
      const results = await searchBlockchain(query);
      setSearch({ query, results });
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    }
  }

  function clearSearch() {
    setSearch(null);
    setSearchInput('');
  }

  const latestIndex = chain.length ? chain[chain.length - 1].index : -1;
  const nextIndex = latestIndex + 1;
  const lastHash = chain.length ? chain[chain.length - 1].hash : '';
  const visibleBlocks = [...(search ? search.results : chain)].reverse();

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>{chainName ? `${chainName} Blockchain` : 'Blockchain'}</h1>        </div>
        <div className="stats">
          <div className="stat">
            <span className="stat-icon stat-icon-blocks">
              <BlocksIcon />
            </span>
            <div>
              <span className="stat-value">{chain.length}</span>
              <span className="stat-label">Blocks</span>
            </div>
          </div>
          <div className="stat-wrap" ref={pendingRef}>
            <button
              type="button"
              className={`stat stat-button ${pendingOpen ? 'open' : ''}`}
              onClick={() => setPendingOpen((o) => !o)}
              aria-expanded={pendingOpen}
              aria-haspopup="dialog"
            >
              <span className={`stat-icon stat-icon-pending ${pending.length ? 'active' : ''}`}>
                <ClockIcon />
              </span>
              <div>
                <span className="stat-value">{pending.length}</span>
                <span className="stat-label">Pending</span>
              </div>
            </button>

            {pendingOpen && (
              <div className="popover" role="dialog" aria-label="Pending transactions">
                <div className="popover-header">
                  <span>Pending Transactions</span>
                  <span className="popover-count">{pending.length}</span>
                </div>
                {pending.length === 0 ? (
                  <p className="popover-empty">No transactions waiting to be mined.</p>
                ) : (
                  <>
                    <ol className="popover-list">
                      {pending.map((tx, i) => (
                        <li key={i}>
                          <span className="pending-dot" />
                          <span className="popover-tx">{tx.data}</span>
                        </li>
                      ))}
                    </ol>
                    <p className="popover-footer">
                      These will be included in the next mined block.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {status && (
        <div className={`status status-${status.type}`} role="status">
          <span>{status.text}</span>
          <button className="status-close" onClick={() => setStatus(null)} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      <div className="layout">
        <aside className="sidebar">
          <section className="panel">
            <h2>Add Transaction</h2>
            <form onSubmit={handleAddTransaction} className="stack">
              <input
                type="text"
                placeholder="e.g. Alice pays Bob 5 BTC"
                value={txInput}
                onChange={(e) => setTxInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" disabled={!txInput.trim()}>
                Add Transaction
              </button>
            </form>
          </section>

          <section className="panel">
            <h2>Mine Block</h2>
            <p className="muted">
              Run Proof of Work to confirm all pending transactions in a new block.
            </p>

            {!loading && (
              <div className="next-block">
                <div className="next-block-row">
                  <span className="field-label">Next Block</span>
                  <span className="next-block-index">#{nextIndex}</span>
                </div>
                <div className="next-block-row">
                  <span className="field-label">Links to</span>
                  <code className="hash-short" title={lastHash}>
                    Block #{nextIndex - 1} · {lastHash.slice(0, 10)}…
                  </code>
                </div>
                <div className="next-block-txs">
                  <span className="field-label">
                    Will include {pending.length} transaction{pending.length === 1 ? '' : 's'}
                  </span>
                  {pending.length === 0 ? (
                    <p className="next-block-warning">
                      No pending transactions. Mining now creates an empty block.
                    </p>
                  ) : (
                    <ul>
                      {pending.map((tx, i) => (
                        <li key={i}>{tx.data}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <button className="btn btn-mine" onClick={handleMine} disabled={mining}>
              {mining ? (
                <>
                  <span className="spinner" /> Mining Block #{nextIndex}...
                </>
              ) : (
                `Mine Block #${nextIndex}`
              )}
            </button>
          </section>

          <section className="panel">
            <h2>Search Blockchain</h2>
            <form onSubmit={handleSearch} className="stack">
              <input
                type="text"
                placeholder="Search transaction data"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <div className="row">
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
                {search && (
                  <button type="button" className="btn btn-secondary" onClick={clearSearch}>
                    Clear
                  </button>
                )}
              </div>
            </form>
            <p className="muted small">Search is case-sensitive.</p>
          </section>
        </aside>

        <main className="chain">
          <div className="chain-header">
            <h2>
              {search
                ? `${search.results.length} block${search.results.length === 1 ? '' : 's'} matching "${search.query}"`
                : 'Blockchain'}
            </h2>
            {!search && (
              <button className="btn btn-secondary" onClick={refreshChain}>
                Refresh
              </button>
            )}
          </div>

          {loading ? (
            <p className="muted">Loading blockchain...</p>
          ) : visibleBlocks.length === 0 ? (
            <p className="empty">
              {search ? 'No blocks contain that text.' : 'No blocks found. Is the backend running?'}
            </p>
          ) : (
            <div className="blocks">
              {visibleBlocks.map((block) => (
                <BlockCard
                  key={block.index}
                  block={block}
                  query={search?.query}
                  isLatest={block.index === latestIndex}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
