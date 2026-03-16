'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateScroll = () => {
            const currentScrollY = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight > 0) {
                setProgress((currentScrollY / scrollHeight) * 100);
            }
        };

        window.addEventListener('scroll', updateScroll, { passive: true });
        updateScroll(); // init
        return () => window.removeEventListener('scroll', updateScroll);
    }, []);

    return (
        <div 
            className="scroll-progress-container"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '3px',
                background: 'transparent',
                zIndex: 9999,
                pointerEvents: 'none'
            }}
        >
            <div 
                className="scroll-progress-bar"
                style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, var(--color-gold), #fff, var(--color-gold))',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2s infinite linear',
                    transition: 'width 0.1s ease-out'
                }}
            />
        </div>
    );
}
