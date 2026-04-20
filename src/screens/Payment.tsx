import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import Ripple from '../components/Ripple';


const Payment: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

    const selectedRoom = (location.state as any)?.selectedRoom;
    const roomPrice = selectedRoom?.price || 0;
    const total = roomPrice;

    const formatPrice = (price: number) => {
        return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const handlePayment = () => {
        setPaymentStatus('processing');
        // The QR code is now displayed. The polling effect will watch for success.
    };

    // Polling effect for payment status
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        const checkStatus = async () => {
            if (paymentStatus === 'processing') {
                try {
                    const res = await fetch(`http://163.44.196.172:8882/api/payment/status`);
                    const json = await res.json();

                    if (json.status?.toLowerCase() === 'paid' || json.status === 'success' || json.message === 'success' || String(json.amount) === String(Math.round(total))) {
                        setPaymentStatus('success');
                        setTimeout(() => {
                            navigate('/hotel-rules', {
                                state: { ...location.state },
                                replace: true
                            });
                        }, 2000);
                    }
                } catch (error) {
                    console.error("Error polling payment status:", error);
                }
            }
        };

        if (paymentStatus === 'processing') {
            interval = setInterval(checkStatus, 3000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [paymentStatus, total, navigate, location.state]);

    // Fetch QR Image via POST
    const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (paymentStatus === 'processing' && !qrImageUrl) {
            const fetchQr = async () => {
                try {
                    // Convert total to an integer (e.g. Satang) since the API rejects floats
                    const priceInt = Math.round(total);
                    const response = await fetch(`http://163.44.196.172:8882/api/payment/qr?device_id=hotel1&price=${priceInt}`, {
                        method: 'POST',
                    });

                    if (response.ok) {
                        const blob = await response.blob();
                        setQrImageUrl(URL.createObjectURL(blob));
                    } else {
                        console.error("Failed to fetch QR:", await response.text());
                    }
                } catch (err) {
                    console.error("QR Fetch Error:", err);
                }
            };
            fetchQr();
        }
    }, [paymentStatus, total, qrImageUrl]);

    return (
        <Layout
            showBackButton={true}
            onBack={() => navigate(-1)}
        >
            <div className="absolute inset-0 w-full h-full bg-slate-100 flex flex-col p-10 pt-64 overflow-y-auto no-scrollbar">

                <div className="flex-none flex flex-col gap-10 px-10 pb-10 w-full max-w-4xl mx-auto items-center shrink-0">

                    <div className="w-full flex flex-col justify-center">
                        <h2 className="text-5xl font-bold text-gray-800 mb-8 text-center">{t('payment_summary')}</h2>

                        <div className="bg-slate-100 rounded-[3rem] shadow-neu-out p-12 border-t-8 border-blue-900 w-full">
                            <div className="flex justify-between mb-8 text-3xl">
                                <span className="text-gray-500">{t('room_charge')}</span>
                                <span className="font-bold text-gray-800">฿ {formatPrice(roomPrice)}</span>
                            </div>

                            <div className="h-0.5 bg-gray-200 mb-12 w-full"></div>

                            <div className="flex justify-between items-center bg-blue-50 p-10 rounded-[2rem]">
                                <span className="text-4xl text-blue-900 font-bold">{t('total')}</span>
                                <span className="text-6xl font-bold text-blue-900">฿ {formatPrice(total)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col mt-4">
                        <h2 className="text-4xl font-bold text-gray-700 mb-8 text-center">{t('select_payment')}</h2>

                        {paymentStatus === 'idle' ? (
                            <div className="flex justify-center mt-4">
                                <button onClick={handlePayment} className="relative overflow-hidden w-full max-w-2xl bg-slate-100 p-8 rounded-[2.5rem] shadow-neu-out hover:shadow-neu-in border-4 border-slate-100 hover:border-blue-100 transition-all group flex items-center justify-center gap-8 active:scale-95">
                                    <Ripple />
                                    <div className="w-24 h-24 bg-gray-800 rounded-xl flex items-center justify-center shrink-0 relative z-10">
                                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                                    </div>
                                    <div className="text-left relative z-10">
                                        <span className="block text-4xl font-bold text-gray-800 group-hover:text-blue-600 mb-1">{t('scan_qr')}</span>
                                        <span className="block text-2xl text-gray-400">{t('promptpay')}</span>
                                    </div>
                                </button>
                            </div>
                        ) : paymentStatus === 'processing' ? (
                            <div className="w-full bg-slate-100 rounded-[3rem] shadow-neu-out flex flex-col items-center justify-center py-12">
                                <h3 className="text-4xl font-bold text-gray-800 mb-6">{t('scan_to_pay')}</h3>
                                <div className="bg-white p-6 rounded-3xl shadow-md border-4 border-blue-100 mb-6 flex items-center justify-center w-72 h-72">
                                    {qrImageUrl ? (
                                        <img
                                            src={qrImageUrl}
                                            alt="PromptPay QR Code"
                                            className="w-64 h-64 object-contain mix-blend-multiply"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-gray-500 animate-pulse">
                                    <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-2xl">{t('waiting_for_payment')}</p>
                                </div>
                                <button
                                    onClick={() => setPaymentStatus('idle')}
                                    className="mt-8 px-8 py-3 rounded-full text-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors"
                                >
                                    {t('cancel')}
                                </button>
                            </div>
                        ) : (
                            <div className="w-full bg-white/50 backdrop-blur-sm rounded-[3rem] shadow-neu-out flex flex-col items-center justify-center py-24 animate-fade-in-up">
                                <div className="relative mb-12">
                                    <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 animate-ping"></div>
                                    <div className="w-40 h-40 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-green-200 relative z-10">
                                        <svg className="w-24 h-24 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-6xl font-bold text-gray-800 mb-6">{t('payment_successful')}</h3>
                                <div className="flex items-center gap-3 text-gray-500">
                                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    <span className="text-3xl ml-2">{t('redirecting')}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Payment;
