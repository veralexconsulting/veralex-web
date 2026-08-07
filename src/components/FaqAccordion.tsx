'use client';

import { useState } from 'react';

interface FaqItem {
    question: string;
    answer: string;
}

interface Props {
    faqs: FaqItem[];
}

export default function FaqAccordion({ faqs }: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                    <div
                        key={idx}
                        style={{
                            background: 'var(--bg-glass)',
                            border: 'var(--border-gold)',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <button
                            onClick={() => setOpenIndex(isOpen ? null : idx)}
                            style={{
                                width: '100%',
                                padding: '1.25rem 1.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                textAlign: 'left',
                                color: isOpen ? 'var(--color-gold)' : 'var(--text-primary)',
                                fontWeight: 600,
                                fontSize: '1.05rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'color 0.2s ease',
                            }}
                        >
                            <span>{faq.question}</span>
                            <span
                                style={{
                                    fontSize: '1.5rem',
                                    lineHeight: 1,
                                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s ease',
                                    color: 'var(--color-gold)',
                                    flexShrink: 0,
                                    marginLeft: '1rem',
                                }}
                            >
                                +
                            </span>
                        </button>
                        <div
                            style={{
                                maxHeight: isOpen ? '500px' : '0px',
                                opacity: isOpen ? 1 : 0,
                                overflow: 'hidden',
                                transition: 'all 0.3s cubic-bezier(0, 1, 0, 1)',
                                padding: isOpen ? '0 1.5rem 1.5rem 1.5rem' : '0 1.5rem',
                            }}
                        >
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
