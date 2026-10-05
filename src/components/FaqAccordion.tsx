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
        <div className="faq-list">
            {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                    <div key={idx} className={`faq-item${isOpen ? ' open' : ''}`}>
                        <button
                            type="button"
                            onClick={() => setOpenIndex(isOpen ? null : idx)}
                            aria-expanded={isOpen}
                        >
                            <span>{faq.question}</span>
                            <span className="faq-toggle" aria-hidden="true">+</span>
                        </button>
                        <div className="faq-answer">
                            <p>{faq.answer}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
