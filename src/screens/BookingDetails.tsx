import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';

const BookingDetails: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    // Phone Number State is no longer needed here as it's passed from PhoneInput screen

    // Helper to extract booking data safely
    const bookingData = (location.state as any)?.booking || {};
    console.log("DEBUG: Booking Data Received:", bookingData);

    // Helper to format date
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Helper to calculate check-out date
    const getCheckOutDate = (checkInStr: string, nights: number) => {
        if (!checkInStr) return "N/A";
        const date = new Date(checkInStr);
        date.setDate(date.getDate() + (parseInt(nights as any) || 1));
        return formatDate(date.toISOString());
    };

    const booking = {
        ref: bookingData.check_in_booking_id || "N/A",
        guestName: `${bookingData.check_in_first_name || ''} ${bookingData.check_in_last_name || ''}`.trim() || "-",
        roomType: bookingData.type_name || bookingData.check_in_type_room || "-",
        checkIn: formatDate(bookingData.check_in_date),
        checkOut: getCheckOutDate(bookingData.check_in_date, bookingData.duration),
        nights: bookingData.duration || 1,
        licensePlate: bookingData.check_in_license_plate || bookingData.customers_license_plate || bookingData.license_plate || "",
        phone: bookingData.customers_phone_number || ""
    };

    const handleConfirm = () => {
        navigate('/hotel-rules', {
            state: {
                ...location.state,
                booking: bookingData
            }
        });
    };

    return (
        <Layout showBackButton={true} onBack={() => navigate('/')}>
            <div
                className="w-full h-full bg-slate-100 flex flex-col relative p-10 pt-64 overflow-hidden no-scrollbar"
            >



                <div className="flex-1 flex flex-col gap-10 px-10 pb-10 items-center w-full max-w-4xl mx-auto animate-fade-in-up">
                    <div className="w-full bg-slate-100 rounded-[3rem] shadow-neu-out p-12 relative overflow-hidden border-t-8 border-blue-600">
                        <div className="absolute top-0 right-0 bg-blue-600 text-white py-4 px-10 rounded-bl-3xl font-bold tracking-wider text-2xl">
                            {t('confirmed_status')}
                        </div>

                        <h2 className="text-6xl font-bold text-gray-800 mb-4">{t('booking_details')}</h2>
                        <p className="text-gray-500 text-3xl mb-12">{t('verify_info')}</p>

                        <div className="grid grid-cols-2 gap-y-12 gap-x-8">
                            <div className="col-span-2">
                                <p className="text-gray-400 text-xl uppercase tracking-wider mb-2">{t('booking_ref_label')}</p>
                                <p className="text-5xl font-mono font-bold text-blue-600 tracking-widest">{booking.ref}</p>
                            </div>

                            <div className="col-span-2 h-0.5 bg-gray-200"></div>

                            <div className="col-span-2">
                                <p className="text-gray-400 text-xl uppercase tracking-wider mb-2">{t('guest_name')}</p>
                                <p className="text-5xl font-bold text-gray-800">{booking.guestName}</p>
                            </div>

                            <div className="col-span-2 h-0.5 bg-gray-200"></div>


                            <div>
                                <p className="text-gray-400 text-xl uppercase tracking-wider mb-2">{t('check_in')}</p>
                                <p className="text-4xl font-bold text-gray-800">{booking.checkIn}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xl uppercase tracking-wider mb-2">Check-out</p>
                                <p className="text-4xl font-bold text-gray-800">{booking.checkOut}</p>
                            </div>

                            <div className="col-span-2 h-0.5 bg-gray-200"></div>

                            <div className="col-span-2">
                                <p className="text-gray-400 text-xl uppercase tracking-wider mb-2">{t('room_type_label')}</p>
                                <p className="text-3xl font-bold text-gray-800">{booking.roomType}</p>
                            </div>

                            {/* Phone Number Display (Moved Up) */}
                            <div className="col-span-2 mt-4 pt-4 border-t border-gray-200">
                                <p className="text-gray-400 text-xl uppercase tracking-wider mb-2">{t('phone_number') || 'Phone Number'}</p>
                                <p className={`text-3xl font-bold ${booking.phone ? 'text-gray-800' : 'text-red-500'}`}>
                                    {booking.phone || t('not_provided') || "Not Provided"}
                                </p>
                            </div>

                            {/* License Plate Display (Moved Down) */}
                            <div className="col-span-2 mt-4 pt-4 border-t border-gray-200">
                                <p className="text-gray-400 text-xl uppercase tracking-wider mb-2">{t('license_plate') || 'License Plate'}</p>
                                <p className="text-3xl font-bold text-gray-800">{booking.licensePlate || "-"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex-1 flex flex-col justify-end gap-8 pb-10">
                        <button
                            onClick={handleConfirm}
                            className="w-full bg-blue-900 text-white py-12 rounded-[2.5rem] text-4xl font-bold shadow-xl hover:bg-blue-800 hover:scale-105 transition-all flex items-center justify-center gap-6"
                        >
                            <span>{t('confirm_details')}</span>
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default BookingDetails;
