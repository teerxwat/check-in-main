import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import Ripple from '../components/Ripple';


const CheckInMethod: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <Layout
            showBackButton={true}
            onBack={() => navigate('/check-in-choice')}
        >
            <div className="w-full h-full bg-slate-100 flex flex-col items-center relative p-10 pt-64">



                <div className="flex-1 flex flex-col items-center justify-center w-full gap-16 animate-fade-in-up">

                    <button
                        onClick={() => navigate('/booking-search')}
                        className="
                            group relative overflow-hidden bg-slate-100 rounded-[3rem] shadow-neu-out w-full max-w-4xl h-64 flex items-center px-16 gap-12
                            active:shadow-neu-in transition-all duration-200 outline-none
                        "
                    >
                        <Ripple />
                        <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                            <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <span className="text-6xl font-bold text-gray-600 group-hover:text-blue-900 transition-colors">{t('enter_booking_code')}</span>
                    </button>


                    <button
                        onClick={() => navigate('/room-selection')}
                        className="
                            group relative overflow-hidden bg-slate-100 rounded-[3rem] shadow-neu-out w-full max-w-4xl h-64 flex items-center px-16 gap-12
                            active:shadow-neu-in transition-all duration-200 outline-none
                        "
                    >
                        <Ripple />
                        <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                            <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <span className="text-6xl font-bold text-gray-600 group-hover:text-blue-900 transition-colors">{t('walk_in_action')}</span>
                    </button>
                </div>

            </div>
        </Layout>
    );
};

export default CheckInMethod;
