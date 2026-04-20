import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import VirtualKeyboard from '../components/VirtualKeyboard';
import Ripple from '../components/Ripple';


const PhoneInput: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [activeField, setActiveField] = useState<'phone' | 'licensePlate'>('phone');
    const [showKeyboard, setShowKeyboard] = useState(false);

    const bookingData = (location.state as any)?.booking || {};

    const handleConfirm = () => {
        if (phoneNumber.length !== 10) {
            setError(t('invalid_phone') || "Please enter valid phone number");
            return;
        }

        // Navigate to BookingDetails with booking data AND phone number AND license plate
        navigate('/booking-details', {
            state: {
                ...location.state,
                booking: {
                    ...bookingData,
                    customers_phone_number: phoneNumber,
                    customers_license_plate: licensePlate
                }
            }
        });
    };

    const handleVirtualKeyPress = (key: string) => {
        if (key === 'ENTER') {
            setShowKeyboard(false);
            setActiveField('phone'); // Return focus to phone or just close
        }
        else if (key === 'BACKSPACE') setLicensePlate(prev => prev.slice(0, -1));
        else if (key === 'SPACE') setLicensePlate(prev => prev + ' ');
        else setLicensePlate(prev => prev + key);
    };

    return (
        <Layout
            showBackButton={true}
            onBack={() => navigate(-1)}
        >
            <div className={`w-full h-full bg-slate-100 flex flex-col relative p-10 pt-44 no-scrollbar overflow-y-auto ${showKeyboard ? 'pb-96' : ''}`}>

                <div className="flex-1 flex flex-col justify-center gap-8 px-10 pb-20 w-full max-w-4xl mx-auto items-center animate-fade-in-up">
                    <div className="w-full flex flex-col justify-center items-center">
                        <div className="mb-6 text-center">
                            <h1 className="text-7xl font-bold text-gray-800 mb-6">{t('contact_info') || 'Contact Info'}</h1>
                            <p className="text-5xl text-gray-500 leading-relaxed mb-4">{t('enter_contact_details') || 'Please enter your details'}</p>
                        </div>

                        {/* Phone Input */}
                        <div
                            onClick={() => {
                                setActiveField('phone');
                                setShowKeyboard(false);
                            }}
                            className={`bg-white rounded-[2rem] shadow-inner border-4 ${error ? 'border-red-500 shake' : (activeField === 'phone' ? 'border-blue-400' : 'border-gray-100')} p-10 w-full mb-6 flex flex-col items-center transition-all relative cursor-pointer`}
                        >
                            <span className="text-3xl text-gray-400 font-bold uppercase mb-4">{t('phone_number')}</span>
                            <div className="flex-1 flex justify-center w-full">
                                <span className={`text-6xl font-mono text-center tracking-[0.2em] font-bold ${phoneNumber ? 'text-gray-800' : 'text-gray-300'}`}>
                                    {phoneNumber || "08XXXXXXXX"}
                                </span>
                            </div>
                            {phoneNumber.length > 0 && activeField === 'phone' && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPhoneNumber('');
                                    }}
                                    className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                                >
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>

                        {/* License Plate Input */}
                        <div
                            onClick={() => {
                                setActiveField('licensePlate');
                                setShowKeyboard(true);
                                setError(null);
                            }}
                            className={`bg-white rounded-[2rem] shadow-inner border-4 ${activeField === 'licensePlate' ? 'border-blue-400' : 'border-gray-100'} p-10 w-full mb-10 flex flex-col items-center transition-all relative cursor-pointer`}
                        >
                            <span className="text-3xl text-gray-400 font-bold uppercase mb-4">{t('license_plate')}</span>
                            <div className="flex-1 flex justify-center w-full">
                                <span className={`text-5xl font-bold text-center ${licensePlate ? 'text-gray-800' : 'text-gray-300'}`}>
                                    {licensePlate || t('optional') || "(Optional)"}
                                </span>
                            </div>
                            {licensePlate.length > 0 && activeField === 'licensePlate' && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLicensePlate('');
                                    }}
                                    className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                                >
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>

                        {error && (
                            <p className="text-5xl text-red-500 font-bold text-center animate-bounce whitespace-pre-line leading-relaxed mb-4">{error}</p>
                        )}
                    </div>

                    {activeField === 'phone' && (
                        <div className="w-full max-w-4xl mx-auto grid grid-cols-3 gap-6 mb-10 animate-fade-in-up">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => {
                                        if (phoneNumber.length < 10) setPhoneNumber(prev => prev + num);
                                        setError(null);
                                    }}
                                    className="relative overflow-hidden h-32 rounded-[2rem] bg-white shadow-neu-out text-7xl font-bold text-gray-700 hover:bg-gray-50 active:shadow-neu-in transition-all"
                                >
                                    <Ripple />
                                    {num}
                                </button>
                            ))}
                            <button
                                onClick={() => setPhoneNumber('')}
                                className="relative overflow-hidden h-32 rounded-[2rem] bg-red-50 shadow-neu-out text-4xl font-bold text-red-500 hover:bg-red-100 active:shadow-neu-in transition-all"
                            >
                                <Ripple />
                                CLEAR
                            </button>
                            <button
                                onClick={() => {
                                    if (phoneNumber.length < 10) setPhoneNumber(prev => prev + '0');
                                    setError(null);
                                }}
                                className="relative overflow-hidden h-32 rounded-[2rem] bg-white shadow-neu-out text-7xl font-bold text-gray-700 hover:bg-gray-50 active:shadow-neu-in transition-all"
                            >
                                <Ripple />
                                0
                            </button>
                            <button
                                onClick={() => setPhoneNumber(prev => prev.slice(0, -1))}
                                className="relative overflow-hidden h-32 rounded-[2rem] bg-slate-100 shadow-neu-out text-gray-600 hover:text-red-500 active:shadow-neu-in transition-all flex items-center justify-center"
                            >
                                <Ripple />
                                <svg className="relative z-10 w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" /></svg>
                            </button>
                        </div>
                    )}

                    <div className="w-full">
                        <button
                            onClick={handleConfirm}
                            disabled={phoneNumber.length !== 10}
                            className={`
                            relative overflow-hidden w-full py-10 rounded-[2rem] text-6xl font-bold shadow-xl transition-all transform mb-10 flex items-center justify-center gap-6
                            ${phoneNumber.length === 10
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-2xl'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                            `}
                        >
                            <Ripple />
                            <span className="relative z-10">{t('next') || 'NEXT'}</span>
                            <svg className="relative z-10 w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                    </div>
                </div>

                {showKeyboard && activeField === 'licensePlate' && (
                    <VirtualKeyboard
                        onKeyPress={handleVirtualKeyPress}
                        onClose={() => {
                            setShowKeyboard(false);
                            setActiveField('phone');
                        }}
                    />
                )}
            </div>
        </Layout>
    );
};

export default PhoneInput;
