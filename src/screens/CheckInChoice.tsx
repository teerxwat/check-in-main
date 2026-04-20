import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import Ripple from '../components/Ripple';
const CheckInChoice: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <Layout
            showHomeButton={false}
            showGlobalLogo={true}
            showBackButton={true}
            onBack={() => navigate('/')}
        >
            <div className="w-full h-full bg-slate-100 flex flex-col items-center relative p-10 pt-44">

                <div className="flex-1 flex flex-col items-center justify-center w-full gap-12">

                    <h1 className="text-8xl font-bold text-gray-800 text-center leading-tight max-w-5xl">
                        {t('what_would_you_like_to_do')}
                    </h1>

                    <div className="grid grid-cols-2 gap-12 w-full max-w-4xl animate-fade-in-up">
                        <button
                            onClick={() => navigate('/check-in-method')}
                            className="
                            aspect-square rounded-[3rem] bg-slate-100 shadow-neu-out overflow-hidden relative
                            flex flex-col items-center justify-center gap-8 
                            active:shadow-neu-in active:scale-95 hover:scale-105 duration-300 transition-all
                            text-gray-600 hover:text-blue-600
                        "
                        >
                            <Ripple />
                            <svg className="w-40 h-40 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            <span className="text-5xl font-medium">{t('check_in')}</span>
                        </button>

                        <button
                            onClick={() => navigate('/check-out-search')}
                            className="
                            aspect-square rounded-[3rem] bg-slate-100 shadow-neu-out 
                            flex flex-col items-center justify-center gap-8 
                            active:shadow-neu-in active:scale-95 hover:scale-105 duration-300 transition-all
                            text-gray-600 hover:text-orange-600
                        "
                        >
                            <svg className="w-40 h-40 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            <span className="text-5xl font-medium">{t('check_out')}</span>
                        </button>

                        <button
                            onClick={() => navigate('/contact-employee')}
                            className="
                            aspect-square rounded-[3rem] bg-slate-100 shadow-neu-out overflow-hidden relative
                            flex flex-col items-center justify-center gap-8 
                            active:shadow-neu-in active:scale-95 hover:scale-105 duration-300 transition-all
                            text-gray-600 hover:text-blue-600
                        "
                        >
                            <Ripple />
                            <svg className="w-40 h-40 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            <span className="text-5xl font-medium">{t('contact_staff')}</span>
                        </button>

                        <button
                            className="
                            aspect-square rounded-[3rem] bg-slate-100 shadow-neu-out overflow-hidden relative
                            flex flex-col items-center justify-center gap-8 
                            active:shadow-neu-in active:scale-95 hover:scale-105 duration-300 transition-all
                            text-gray-600 hover:text-blue-600
                        "
                        >
                            <Ripple />
                            <svg className="w-40 h-40 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="text-5xl font-medium">{t('hotel_info')}</span>
                        </button>

                        <button
                            onClick={() => navigate('/tourist-attractions')}
                            className="
                            aspect-square rounded-[3rem] bg-slate-100 shadow-neu-out overflow-hidden relative
                            flex flex-col items-center justify-center gap-8 
                            active:shadow-neu-in active:scale-95 hover:scale-105 duration-300 transition-all
                            text-gray-600 hover:text-blue-600
                        "
                        >
                            <Ripple />
                            <svg className="w-40 h-40 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                            <span className="text-5xl font-medium">{t('tourist_info')}</span>
                        </button>

                        <button
                            onClick={() => navigate('/nearby-food')}
                            className="
                            aspect-square rounded-[3rem] bg-slate-100 shadow-neu-out overflow-hidden relative
                            flex flex-col items-center justify-center gap-8 
                            active:shadow-neu-in active:scale-95 hover:scale-105 duration-300 transition-all
                            text-gray-600 hover:text-blue-600
                        "
                        >
                            <Ripple />
                            <svg className="w-40 h-40 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
                            </svg>
                            <span className="text-5xl font-medium">{t('nearby_dining')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Layout >
    );
};

export default CheckInChoice;
