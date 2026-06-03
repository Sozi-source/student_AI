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
    ],
  },
  {
    category: '📚 Entry Requirements',
    items: [
      'Certificate entry requirements',
      'Diploma entry requirements',
      'Degree entry requirements',
      'Do I qualify for the programme?',
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
      'Internship centres list',
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

// ── Inline renderer: **bold** and URLs ──
function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s]+)/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part))
      return <strong key={i} className={styles.inlineBold}>{part.replace(/\*\*/g, '')}</strong>;
    if (/^https?:\/\//.test(part)) {
      const display = part.replace(/^https?:\/\//, '').replace(/\/$/, '');
      return (
        <a key={i} href={part} target="_blank" rel="noopener" className={styles.msgLink}>
          🔗 {display}
        </a>
      );
    }
    return part;
  });
}

// ── Premium card message renderer ──
function MessageText({ content }) {
  const text = typeof content === 'string' ? content : String(content ?? '');
  const lines = text.split('\n');

  // Group lines into sections: each **Heading** starts a new card section
  const sections = [];
  let current = { heading: null, rows: [] };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      if (current.rows.length > 0) current.rows.push({ type: 'spacer' });
      return;
    }

    const isHeading = /^\*\*[^*]+\*\*$/.test(trimmed);
    if (isHeading) {
      if (current.heading !== null || current.rows.length > 0) {
        sections.push(current);
      }
      current = { heading: trimmed.replace(/\*\*/g, ''), rows: [] };
      return;
    }

    const stepMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    const isBullet = /^[\*\-•]\s+/.test(trimmed);
    const isSubHead = !isBullet && !stepMatch && trimmed.endsWith(':') && trimmed.length < 70;

    if (stepMatch) {
      current.rows.push({ type: 'step', num: stepMatch[1], text: stepMatch[2] });
    } else if (isBullet) {
      current.rows.push({ type: 'bullet', text: trimmed.replace(/^[\*\-•]\s+/, '') });
    } else if (isSubHead) {
      current.rows.push({ type: 'subhead', text: trimmed });
    } else {
      current.rows.push({ type: 'line', text: trimmed });
    }
  });
  sections.push(current);

  // Remove trailing spacers
  sections.forEach(s => {
    while (s.rows.length && s.rows[s.rows.length - 1].type === 'spacer') s.rows.pop();
  });

  const BULLET_ICONS = ['◆', '✦', '▸', '◈', '✧', '⬡'];
  let bulletIdx = 0;

  const renderRow = (row, i) => {
    if (row.type === 'spacer') return <div key={i} className={styles.rowSpacer} />;
    if (row.type === 'subhead') return (
      <div key={i} className={styles.subHead}>{row.text}</div>
    );
    if (row.type === 'step') return (
      <div key={i} className={styles.stepRow}>
        <span className={styles.stepBadge}>{row.num}</span>
        <span className={styles.stepText}>{renderInline(row.text)}</span>
      </div>
    );
    if (row.type === 'bullet') {
      const icon = BULLET_ICONS[bulletIdx++ % BULLET_ICONS.length];
      return (
        <div key={i} className={styles.bulletRow}>
          <span className={styles.bulletIcon}>{icon}</span>
          <span className={styles.bulletText}>{renderInline(row.text)}</span>
        </div>
      );
    }
    return <p key={i} className={styles.bodyLine}>{renderInline(row.text)}</p>;
  };

  // Single section with no heading → plain bubble
  if (sections.length === 1 && !sections[0].heading) {
    return (
      <div className={styles.msgPlain}>
        {sections[0].rows.map(renderRow)}
      </div>
    );
  }

  return (
    <div className={styles.msgCard}>
      {sections.map((sec, si) => (
        <div key={si} className={styles.cardSection}>
          {sec.heading && (
            <div className={styles.sectionHeader}>
              <span className={styles.sectionDot} />
              <span className={styles.sectionTitle}>{sec.heading}</span>
            </div>
          )}
          {sec.rows.length > 0 && (
            <div className={styles.sectionBody}>
              {sec.rows.map(renderRow)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

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
    const q = typeof text === 'string' && text.trim() ? text.trim() : input.trim();
    if (!q || loading) return;
    setInput('');
    setShowMenu(false);

    const history = [...messages, { role: 'user', content: q }];
    setMessages(history);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      const reply =
        data && typeof data.message === 'string' && data.message
          ? data.message
          : 'Sorry, something went wrong. Please try again.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Connection error. Please check your internet and try again.' },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className={styles.shell}>

      <header className={styles.header}>
        <div className={styles.headerAvatar}>HND</div>
        <div className={styles.headerInfo}>
          <span className={styles.headerTitle}>HND Academic Assistant</span>
          <span className={styles.headerSub}>Imperial College · Human Nutrition & Dietetics</span>
        </div>
        <span className={styles.onlineDot} />
      </header>

      <main className={styles.chat}>
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

        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? styles.userRow : styles.botRow}>
            {m.role === 'assistant' && <div className={styles.botAvatar}>AI</div>}
            {m.role === 'user' ? (
              <div className={styles.userBubble}>{m.content}</div>
            ) : (
              <div className={styles.botBubble}>
                <MessageText content={m.content} />
              </div>
            )}
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
                        <button key={ii} className={styles.menuItem} onClick={() => send(item)}>
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

      <footer className={styles.footer}>
        <button className={styles.menuBtn} onClick={() => setShowMenu(!showMenu)} aria-label="Browse services">
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