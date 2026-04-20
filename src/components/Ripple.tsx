import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';

interface RippleProps {
    color?: string;
    duration?: number;
    className?: string;
}

interface RippleType {
    x: number;
    y: number;
    size: number;
    key: number;
}

const Ripple: React.FC<RippleProps> = ({ color = 'rgba(0,0,0,0.1)', duration = 600, className = '' }) => {
    const [ripples, setRipples] = useState<RippleType[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const parent = containerRef.current?.parentElement;
        if (!parent) return;

        const addRipple = (event: PointerEvent) => {
            const trigger = parent.getBoundingClientRect();

            const size = Math.max(trigger.width, trigger.height);
            const x = event.clientX - trigger.left - size / 2;
            const y = event.clientY - trigger.top - size / 2;
            const newRipple = { x, y, size, key: Date.now() };

            setRipples((prevRipples) => [...prevRipples, newRipple]);
        };

        // Attach listener to the parent element
        parent.addEventListener('pointerdown', addRipple as EventListener);

        // Make sure parent is positioned so absolute works
        if (getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }
        parent.style.overflow = 'hidden';

        return () => {
            parent.removeEventListener('pointerdown', addRipple as EventListener);
        };
    }, []);

    useLayoutEffect(() => {
        let bounce: ReturnType<typeof setTimeout>;
        if (ripples.length > 0) {
            bounce = setTimeout(() => {
                setRipples([]);
            }, duration);
        }
        return () => clearTimeout(bounce);
    }, [ripples, duration]);

    return (
        <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none rounded-inherit ${className}`} style={{ borderRadius: 'inherit' }}>
            {ripples.map((ripple) => (
                <span
                    key={ripple.key}
                    style={{
                        top: ripple.y,
                        left: ripple.x,
                        width: ripple.size,
                        height: ripple.size,
                        backgroundColor: color,
                        animationDuration: `${duration}ms`,
                    }}
                    className="absolute rounded-full opacity-50 animate-ripple pointer-events-none"
                />
            ))}
        </div>
    );
};

export default Ripple;
