import React from 'react';

const HotelLogo: React.FC<{ className?: string }> = ({ className = "w-32" }) => {
    return (
        <img
            src="/images/logo_v2.png"
            alt="PRAYAA WELLNESS"
            className={`object-contain ${className}`}
        />
    );
};

export default HotelLogo;
