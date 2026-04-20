import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-32" }) => {
    return (
        <img
            src="/logo_prayaa.png"
            alt="Prayaa Wellness"
            className={`object-contain ${className}`}
        />
    );
};

export default Logo;
