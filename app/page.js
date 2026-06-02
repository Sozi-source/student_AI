'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';

const SERVICES = [
  {
    category: '📋 Indexing',
    items: [
      'What is KNDI indexing?',
      'How to apply for indexing',
      'Documents required for indexing',
      'Indexing fees',
      'Check application status',
      'Paid via institution',
      'Late payment penalty',
    ],
  },
  {
    category: '📝 Aptitude Exam',
    items: [
      'What is the aptitude exam?',
      'Aptitude exam 2026 dates',
      'How to register for aptitude exam',
      'Aptitude exam fees',
      'Aptitude exam results',
    ],
  },
  {
    category: '⬆️ Upgrading Exams',
    items: [
      'What is upgrading exam?',
      'Upgrading exam 2026 dates',
      'How to register for upgrading',
      'Upgrading exam fees',
      'Upgrading exam eligibility',
      'Upgrading exam centers',
      'Upgrading exam results',
      'Phase 17 upgrading details',
    ],
  },
  {
    category: '🎓 Licensing Exams (LPE)',
    items: [
      'What is the LPE?',
      'LPE 2026 dates',
      'How to register for LPE',
      'LPE fees',
      'LPE eligibility requirements',
      'LPE exam centers',
      'LPE results',
    ],
  },
  {
    category: '🪪 Registration & Licensing',
    items: [
      'How to register with KNDI',
      'License renewal process',
      'Annual practising certificate',
    ],
  },
  {
    category: '🏥 Internship',
    items: [
      'Internship requirements',
      'How to apply for internship',
      'Internship allowance',
    ],
  },
  {
    category: '📤 Send Documents to HOD',
    items: [
      'How to submit documents',
      'Send via WhatsApp',
      'Send via Email',
    ],
  },
  {
    category: '📞 Contacts & Links',
    items: [
      'KNDI phone number',
      'KNDI email address',
      'KNDI portal link',
    ],
  },
];

const QUICK = [
  { label: '📋 Indexing steps', q: 'What are the steps to apply for KNDI indexing?' },
  { label: '⬆️ Upgrading 2026', q: 'What are the upgrading exam dates for 2026?' },
  { label: '🎓 LPE details', q: 'Tell me about the Licensing Professional Exam (LPE)' },
  { label: '📤 Submit docs', q: 'How do I submit documents to the HOD?' },
];

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! 👋 I'm your HND academic assistant. Ask me anything about KNDI indexing, upgrading, licensing exams, or use the quick buttons below.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [openCat, setOpenCat] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const q = text || input.trim();
    if (!q || loading) return;
    setInput('');
    setShowMenu(false);
    setMessages((prev) => [...prev, { role: 'user', content: q }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: q }] }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div className={styles.shell}>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerAvatar}>HND</div>
        <div className={styles.headerInfo}>
          <span className={styles.headerTitle}>HND Academic Assistant</span>
          <span className={styles.headerSub}>Imperial College · Human Nutrition & Dietetics</span>
        </div>
        <span className={styles.onlineDot} />
      </header>

      {/* Chat area */}
      <main className={styles.chat}>

        {/* Quick action cards */}
        {messages.length <= 1 && (
          <div className={styles.quickGrid}>
            {QUICK.map((q) => (
              <button key={q.q} className={styles.quickCard} onClick={() => send(q.q)}>
                <span className={styles.quickLabel}>{q.label}</span>
                <span className={styles.quickArrow}>›</span>
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? styles.userRow : styles.botRow}>
            {m.role === 'assistant' && <div className={styles.botAvatar}>AI</div>}
            <div className={m.role === 'user' ? styles.userBubble : styles.botBubble}>
              {m.content.split('\n').map((line, j) => (
                <span key={j}>{line}{j < m.content.split('\n').length - 1 && <br />}</span>
              ))}
            </div>
          </div>
        ))}

        {loading && (
          <div className={styles.botRow}>
            <div className={styles.botAvatar}>AI</div>
            <div className={styles.botBubble}>
              <span className={styles.typing}><span /><span /><span /></span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* Services slide-up panel */}
      {showMenu && (
        <div className={styles.menuOverlay} onClick={() => setShowMenu(false)}>
          <div className={styles.menuPanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.menuHandle} />
            <p className={styles.menuTitle}>Browse Services</p>
            <div className={styles.menuScroll}>
              {SERVICES.map((s, si) => (
                <div key={si} className={styles.menuCat}>
                  <button
                    className={styles.menuCatBtn}
                    onClick={() => setOpenCat(openCat === si ? null : si)}
                  >
                    <span>{s.category}</span>
                    <span className={styles.menuChevron}>{openCat === si ? '▲' : '▼'}</span>
                  </button>
                  {openCat === si && (
                    <div className={styles.menuItems}>
                      {s.items.map((item, ii) => (
                        <button
                          key={ii}
                          className={styles.menuItem}
                          onClick={() => send(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer input */}
      <footer className={styles.footer}>
        <button
          className={styles.menuBtn}
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Browse services"
        >
          ☰
        </button>
        <input
          ref={inputRef}
          className={styles.input}
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button
          className={styles.sendBtn}
          onClick={() => send()}
          disabled={loading || !input.trim()}
          aria-label="Send"
        >
          ➤
        </button>
      </footer>

      <div className={styles.footerNote}>
        <a href="tel:+254011251486">📞 +254 0112 514 865</a>
        <span>·</span>
        <a href="mailto:info@kndi.institute">✉ info@kndi.institute</a>
        <span>·</span>
        <a href="https://kndi.institute" target="_blank" rel="noopener">🌐 kndi.institute</a>
      </div>
    </div>
  );
}