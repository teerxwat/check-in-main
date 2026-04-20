import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { CLOUD_DATABASE_URL } from '../config';

const CheckOutBill: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const [processing, setProcessing] = useState(false);

    const booking = location.state?.booking;

    // Redirect if no booking data
    if (!booking) {
        navigate('/check-out-search');
        return null;
    }

    const totalAmount = 0.00; // In a real app, this would be dynamic

    const handleConfirm = async () => {
        if (totalAmount > 0) {
            // Navigate to Payment Screen if there is a balance
            navigate('/check-out-payment', {
                state: {
                    booking: booking,
                    totalAmount: totalAmount
                }
            });
            return;
        }

        setProcessing(true);
        try {
            const res = await fetch(`${CLOUD_DATABASE_URL}/api/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    room_no: booking.room_no,
                    booking_id: booking.check_in_booking_id
                })
            });
            const json = await res.json();

            if (json.success) {
                setTimeout(() => {
                    navigate('/check-out-rating', { state: { booking } });
                }, 1000);
            } else {
                alert("Checkout Failed: " + json.message);
                setProcessing(false);
            }
        } catch (error) {
            console.error("Checkout Error:", error);
            alert("System Error");
            setProcessing(false);
        }
    };

    return (
        <Layout
            showBackButton={true}
            onBack={() => navigate('/check-out-search')}
        >
            <div className="w-full h-full bg-orange-50 flex flex-col relative p-10 pt-64">

                <div className="flex-1 flex flex-col gap-10 px-10 pb-10 items-center justify-center w-full max-w-4xl mx-auto animate-fade-in-up">

                    <div className="w-full bg-white rounded-[3rem] shadow-xl p-12 border-t-8 border-orange-500">
                        <div className="flex flex-col mb-10">
                            <div>
                                <h2 className="text-5xl font-bold text-gray-800 mb-4">{t('outstanding_balance')}</h2>
                                <p className="text-gray-400 text-2xl uppercase tracking-wider mb-2">{t('room_number')}</p>
                                <p className="text-5xl font-bold text-orange-600">{booking.room_no}</p>
                            </div>
                            <div className="mt-8 text-left">
                                <p className="text-gray-400 text-2xl uppercase tracking-wider mb-2">{t('guest_label')}</p>
                                <p className="text-4xl font-bold text-gray-800">{booking.customer_name || t('customer_default')}</p>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 mb-10 w-full"></div>

                        <div className="space-y-8">
                            <div className="flex justify-between text-3xl">
                                <span className="text-gray-500">{t('room_charge_label')} ({booking.type_name || 'Standard'})</span>
                                <span className="font-bold text-gray-800">{t('paid')}</span>
                            </div>
                            <div className="flex justify-between text-3xl">
                                <span className="text-gray-500">{t('minibar_extra')}</span>
                                <span className="font-bold text-gray-800">฿ 0.00</span>
                            </div>
                        </div>

                        <div className="h-0.5 bg-gray-100 my-10 w-full"></div>

                        <div className="flex justify-between items-center bg-orange-50 p-10 rounded-[2rem]">
                            <span className="text-4xl text-orange-900 font-bold">{t('total')}</span>
                            <span className="text-6xl font-bold text-orange-900">฿ 0.00</span>
                        </div>
                    </div>

                    <div className="w-full flex-1 flex flex-col justify-end gap-8">
                        {!processing ? (
                            <button
                                onClick={handleConfirm}
                                className={`w-full text-white py-12 rounded-[3rem] text-5xl font-bold shadow-xl transform hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 ${totalAmount > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'
                                    }`}
                            >
                                <span>{totalAmount > 0 ? t('pay_balance') || 'Pay Balance' : t('confirm_checkout')}</span>
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        ) : (
                            <div className="w-full bg-white rounded-[3rem] shadow-inner flex flex-col items-center justify-center py-20">
                                <div className="w-24 h-24 border-8 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-8"></div>
                                <h3 className="text-4xl font-bold text-gray-800">{t('processing')}</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CheckOutBill;
