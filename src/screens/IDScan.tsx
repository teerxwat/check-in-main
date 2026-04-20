import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { LOCAL_HARDWARE_URL, CLOUD_DATABASE_URL } from '../config';

const IDScan: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const [status, setStatus] = useState<'waiting' | 'scanning' | 'complete' | 'error'>('waiting');

    const idType = (location.state as any)?.idType || 'thai_id';
    const nextRoute = location.state?.nextRoute || '/booking-search';

    const [errorMsg, setErrorMsg] = useState<string>('');

    // Clear previous card data moved to IDSelection to avoid race condition
    // useEffect(() => {
    //     fetch('/api/clear', { method: 'POST' })
    //         .catch(err => console.error("Failed to clear card data:", err));
    // }, []);

    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/'); // Go back to home on timeout
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    useEffect(() => {
        let isPolling = true;

        const pollCardStatus = async () => {
            if (isPolling) {
                try {
                    // console.log("Polling /api/status...");
                    const statusResponse = await fetch(`${LOCAL_HARDWARE_URL}/api/status`);
                    const statusData = await statusResponse.json();

                    if (statusData.present === true) {
                        setStatus('scanning');
                        setErrorMsg('');

                        const readResponse = await fetch(`${LOCAL_HARDWARE_URL}/api/read`);
                        const readData = await readResponse.json();

                        if (readData.present === true && readData.data) {
                            const cardInfo = readData.data;
                            let idNumber = '';

                            if (idType === 'thai_id') {
                                let rawId = cardInfo.CitizenNo || cardInfo.pid || cardInfo.id || cardInfo.uid;
                                if (rawId) {
                                    rawId = String(rawId).replace(/[^0-9]/g, '');
                                    if (/^\d{13}$/.test(rawId)) {
                                        idNumber = rawId;
                                    }
                                }
                            } else {
                                idNumber = cardInfo.passport_number || cardInfo.document_number;
                                if (!idNumber) {
                                    const rawId = cardInfo.id || cardInfo.uid;
                                    if (rawId && !/^\d{13}$/.test(String(rawId).replace(/[^0-9]/g, ''))) {
                                        idNumber = rawId;
                                    }
                                }
                            }

                            if (idNumber) {
                                setStatus('complete');
                                isPolling = false;

                                // Send 'off' command to hardware
                                fetch(`${LOCAL_HARDWARE_URL}/api/set-mode`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ type: 'off' })
                                }).catch(e => console.error("Failed to set off mode:", e));

                                // Add delay to allow the "complete" green animation to be visible
                                await new Promise(resolve => setTimeout(resolve, 1500));

                                try {
                                    // New Flow: Update Guest Info (Booking is already passed in state)
                                    const booking = (location.state as any)?.booking;

                                    if (booking && booking.check_in_booking_id) {
                                        // Booking Flow: Update Info & Check-in
                                        const updateResponse = await fetch(`${CLOUD_DATABASE_URL}/api/update-guest-info`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                booking_id: booking.check_in_booking_id,
                                                id_card_data: cardInfo,
                                                phone_number: booking.customers_phone_number || "",
                                                license_plate: booking.customers_license_plate || ""
                                            }),
                                        });

                                        if (updateResponse.ok) {
                                            // Success -> Go to Key Dispense
                                            navigate(nextRoute, {
                                                state: {
                                                    ...location.state,
                                                    idCardData: cardInfo
                                                }
                                            });
                                        } else {
                                            setStatus('error');
                                            setErrorMsg("Update Failed");
                                            setTimeout(() => navigate('/'), 3000);
                                        }
                                    } else {
                                        // Walk-in Flow: No booking yet, just pass data to next screen (Customer Info)
                                        navigate(nextRoute, {
                                            state: {
                                                ...location.state,
                                                idCardData: cardInfo
                                            }
                                        });
                                    }
                                } catch (e) {
                                    setStatus('error');
                                    setErrorMsg("Connection Error");
                                    setTimeout(() => navigate('/'), 3000);
                                }
                            } else { // if (!idNumber)
                                // Keep scanning state to avoid flashing red if hardware is still parsing data
                                setStatus('scanning');
                                setTimeout(() => {
                                    if (isPolling) {
                                        setStatus('waiting');
                                        setErrorMsg('');
                                    }
                                }, 1000);
                            }
                        } else { // if (!readData.present || !readData.data)
                            // Keep scanning state to avoid flashing red if hardware is still parsing data
                            setStatus('scanning');
                        }
                    } else { // if (statusData.present === false)
                        if (status === 'scanning' || status === 'complete') {
                            setStatus('waiting');
                            setErrorMsg('');
                        }
                    }
                } catch (error) {
                    // console.error(error); // Log the error for debugging
                    if (status !== 'error') { // Only set error if not already in error state
                        setStatus('error');
                        setErrorMsg("Connection Error");
                        setTimeout(() => {
                            if (isPolling) {
                                setStatus('waiting');
                                setErrorMsg('');
                            }
                        }, 3000);
                    }
                }
            }

            if (isPolling && status !== 'error' && status !== 'complete') { // Continue polling only if not complete or in unrecoverable error
                setTimeout(pollCardStatus, 1000);
            }
        };

        pollCardStatus();

        return () => {
            isPolling = false;
        };
    }, []); // Empty dependency array for create-once polling

    // Reset polling when back to waiting - actually this logic relies on component remount mostly
    // or manual reset. In this simple version, assume mount/unmount or navigate handles reset.

    // Mock Scan Removed


    return (
        <Layout showHomeButton={false} showGlobalLogo={false}>
            <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center relative p-10 pt-64">


                <div className="flex-1 flex flex-col items-center justify-center w-full gap-10 animate-fade-in-up">
                    <div className="flex gap-20 px-20 items-center justify-center w-full">
                        {/* Left: ID Card Visual */}
                        <div className="flex-1 flex items-center justify-end">
                            <div
                                className="relative w-[30rem] h-[19rem] bg-slate-100 rounded-3xl shadow-neu-out border-4 border-slate-200 overflow-hidden flex items-center justify-center transition-colors"
                            >
                                {idType === 'thai_id' ? (
                                    <>
                                        <div className="absolute top-8 left-8 w-24 h-32 bg-gray-200 rounded-lg"></div>
                                        <div className="absolute top-8 left-40 right-8 h-4 bg-gray-200 rounded"></div>
                                        <div className="absolute top-16 left-40 right-8 h-4 bg-gray-200 rounded"></div>
                                        <div className="absolute top-24 left-40 w-48 h-4 bg-gray-200 rounded"></div>
                                    </>
                                ) : (
                                    <>
                                        <div className="absolute top-4 left-4 right-4 h-8 bg-blue-900/20 rounded-t-lg"></div>
                                        <div className="absolute bottom-4 left-8 w-24 h-32 bg-gray-200 rounded-lg"></div>
                                        <div className="absolute top-20 left-40 right-8 h-4 bg-gray-200 rounded"></div>
                                        <div className="absolute top-28 left-40 right-8 h-4 bg-gray-200 rounded"></div>
                                        <div className="absolute bottom-10 right-8 w-16 h-16 rounded-full border-2 border-gray-300"></div>
                                    </>
                                )}

                                {status === 'scanning' && (
                                    <div className="absolute top-0 left-0 w-full h-4 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-scan"></div>
                                )}

                                {status === 'complete' && (
                                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-sm transition-all">
                                        <div className="w-24 h-24 bg-green-500 rounded-full text-white flex items-center justify-center shadow-lg animate-bounce">
                                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                    </div>
                                )}

                                {status === 'error' && (
                                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center backdrop-blur-sm transition-all">
                                        <div className="w-24 h-24 bg-red-500 rounded-full text-white flex items-center justify-center shadow-lg animate-pulse">
                                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center max-w-2xl h-full">
                            <h1 className="text-6xl font-bold text-gray-800 mb-6">
                                {idType === 'thai_id' ? t('scan_id_title') : t('scan_passport_title')}
                            </h1>

                            <div className="h-32 flex items-center mb-8">
                                <p className="text-4xl font-bold text-blue-900">
                                    {status === 'waiting' && (idType === 'thai_id' ? t('please_insert_thai_id') : t('please_scan_passport'))}
                                    {status === 'scanning' && t('scanning')}
                                    {status === 'complete' && <span className="text-green-600">{t('verification_complete')}</span>}
                                    {status === 'error' && (
                                        <span className="text-red-500">
                                            {errorMsg || (nextRoute === '/customer-info' ? t('already_checked_in') : t('booking_not_found'))}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <p className="text-gray-400 text-2xl font-medium mb-2">{t('auto_return_home')}</p>
                    <div className="text-4xl font-bold text-gray-500 bg-white px-6 py-2 rounded-full shadow-md">
                        {countdown}s
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes scan {
                    0% { top: 0%; }
                    50% { top: 100%; }
                    100% { top: 0%; }
                }
                .animate-scan {
                    animation: scan 2s linear infinite;
                }
            `}</style>
        </Layout >
    );
};

export default IDScan;
