import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';

const CheckOutComplete: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const [countdown, setCountdown] = React.useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <Layout showHomeButton={false} showGlobalLogo={false}>
            <div className="w-full h-full bg-orange-500 flex flex-col items-center justify-center relative p-10 overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-400 to-orange-600"></div>

                <div className="relative z-10 flex flex-col items-center justify-center h-full w-full animate-fade-in-up">
                    <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center shadow-2xl mb-16 animate-bounce">
                        <svg className="w-32 h-32 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>

                    <h2 className="text-8xl font-bold text-white mb-10">{t('checkout_complete')}</h2>
                    <p className="text-orange-100 text-5xl mb-32 max-w-4xl leading-relaxed">{t('thank_you')}</p>

                    <button
                        onClick={() => navigate('/')}
                        className="bg-white/20 text-white border-2 border-white/50 px-20 py-8 rounded-full text-3xl font-bold hover:bg-white hover:text-orange-600 transition-all w-full max-w-xl backdrop-blur-sm shadow-lg"
                    >
                        {t('back_home')} ({countdown}s)
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default CheckOutComplete;
