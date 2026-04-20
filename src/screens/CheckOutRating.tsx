import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { CLOUD_DATABASE_URL } from '../config';
import VirtualKeyboard from '../components/VirtualKeyboard';


const CheckOutRating: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const [processing, setProcessing] = useState(false);
    const [showKeyboard, setShowKeyboard] = useState(false);

    const [ratings, setRatings] = useState({
        cleanliness: 0,
        staff: 0,
        check_in: 0,
        facilities: 0,
        overall: 0
    });
    const [comment, setComment] = useState('');

    const booking = location.state?.booking;

    const handleRating = (category: keyof typeof ratings, score: number) => {
        setRatings(prev => ({ ...prev, [category]: score }));
    };

    const handleKeyPress = (key: string) => {
        if (key === 'ENTER') setShowKeyboard(false);
        else if (key === 'BACKSPACE') setComment(prev => prev.slice(0, -1));
        else if (key === 'SPACE') setComment(prev => prev + ' ');
        else setComment(prev => prev + key);
    };

    const handleSubmit = async () => {
        if (!booking || !booking.customers_id) {
            alert("Error: No customer data found.");
            navigate('/check-out-search');
            return;
        }

        setProcessing(true);
        try {
            const res = await fetch(`${CLOUD_DATABASE_URL}/api/submit-review`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customers_id: booking.customers_id,
                    cleanliness: ratings.cleanliness,
                    staff: ratings.staff,
                    check_in: ratings.check_in,
                    facilities: ratings.facilities,
                    overall: ratings.overall,
                    comment: comment
                })
            });
            const json = await res.json();
            if (json.success) {
                navigate('/check-out-complete');
            } else {
                alert("Submit Failed: " + json.message);
                setProcessing(false);
            }
        } catch (error) {
            console.error("Submit Error:", error);
            alert("System Error");
            setProcessing(false);
        }
    };

    const handleSkip = () => {
        navigate('/check-out-complete');
    };

    const renderStars = (category: keyof typeof ratings, label: string) => (
        <div className="flex flex-col gap-2 mb-6">
            <h3 className="text-3xl font-bold text-gray-700">{t(label)}</h3>
            <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => handleRating(category, star)}
                        className="focus:outline-none transform hover:scale-110 transition-transform active:scale-95"
                    >
                        <svg
                            className={`w-16 h-16 drop-shadow-sm transition-colors ${ratings[category] >= star ? 'text-orange-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </button>
                ))}
            </div>
        </div>
    );

    // Validation: Require at least 1 star total in any category
    const isFormValid = Object.values(ratings).some(r => r > 0);

    return (
        <Layout
            showBackButton={false}
            onBack={() => navigate('/check-out-bill')}
            showHomeButton={false}
        >
            <div className="w-full h-full bg-slate-50 flex flex-col relative p-10 pt-56 overflow-y-auto no-scrollbar">

                <div className="flex-1 flex flex-col gap-6 px-10 pb-10 w-full max-w-7xl mx-auto animate-fade-in-up">
                    <div className="text-center mb-4">
                        <h2 className="text-5xl font-bold text-gray-800 mb-4">{t('rate_stay')}</h2>
                        <p className="text-2xl text-gray-500">{t('rate_desc')}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-12 gap-y-2">
                        {renderStars('cleanliness', 'review_cleanliness')}
                        {renderStars('staff', 'review_service')}
                        {renderStars('check_in', 'review_check_in')}
                        {renderStars('facilities', 'review_facilities')}

                        <div className="col-span-2 flex flex-col items-center mt-4 border-t pt-6 bg-orange-50 rounded-xl p-4">
                            {renderStars('overall', 'review_overall')}
                        </div>
                    </div>

                    <div className="w-full">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            onFocus={() => setShowKeyboard(true)}
                            placeholder={t('comment_placeholder')}
                            className="w-full h-32 p-6 rounded-[2rem] bg-white border-2 border-transparent shadow-neu-in text-2xl focus:outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100 transition-all resize-none placeholder-gray-300"
                        />
                    </div>

                    <div className="flex flex-col gap-4 mt-auto">
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid || processing}
                            className={`
                                w-full py-6 rounded-[2.5rem] text-3xl font-bold shadow-xl transition-all
                                ${isFormValid && !processing
                                    ? 'bg-orange-600 text-white hover:bg-orange-700 hover:scale-105 active:scale-95'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                            `}
                        >
                            {processing ? t('processing') : t('submit_rating')}
                        </button>
                        <button
                            onClick={handleSkip}
                            className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 text-2xl"
                        >
                            {t('skip_rating')}
                        </button>
                    </div>
                </div>
                {showKeyboard && (
                    <VirtualKeyboard
                        onKeyPress={handleKeyPress}
                        onClose={() => setShowKeyboard(false)}
                    />
                )}
            </div>
        </Layout>
    );
};

export default CheckOutRating;
