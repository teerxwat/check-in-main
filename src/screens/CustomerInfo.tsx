import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import VirtualKeyboard from '../components/VirtualKeyboard';
import Ripple from '../components/Ripple';
import Logo from '../components/Logo';

const CustomerInfo: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    const idType = (location.state as any)?.idType || 'thai_id';

    const scannedData = (location.state as any)?.scannedData || (location.state as any)?.idCardData || null;
    const validatedIdNumber = (location.state as any)?.idNumber || '';

    const [bookingCode] = useState(() => {
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `WI-${dateStr}-${random}`;
    });

    const [formData, setFormData] = useState({
        firstName: (() => {
            if (scannedData?.given_names) return scannedData.given_names;
            if (scannedData?.name_en) return scannedData.name_en.split(' ')[0];
            if (scannedData?.name_th) {
                let name = scannedData.name_th.trim();
                const prefixes = ['นาย', 'นางสาว', 'นาง', 'เด็กชาย', 'เด็กหญิง'];
                for (const prefix of prefixes) {
                    if (name.startsWith(prefix)) {
                        name = name.replace(prefix, '').trim();
                        break;
                    }
                }
                return name.split(' ')[0] || '';
            }
            return '';
        })(),
        lastName: (() => {
            if (scannedData?.surname) return scannedData.surname;
            if (scannedData?.name_en) return scannedData.name_en.split(' ').slice(1).join(' ');
            if (scannedData?.name_th) {
                let name = scannedData.name_th.trim();
                const prefixes = ['นาย', 'นางสาว', 'นาง', 'เด็กชาย', 'เด็กหญิง'];
                for (const prefix of prefixes) {
                    if (name.startsWith(prefix)) {
                        name = name.replace(prefix, '').trim();
                        break;
                    }
                }
                return name.split(' ').slice(1).join(' ') || '';
            }
            return '';
        })(),
        idNumber: validatedIdNumber || scannedData?.passport_number || scannedData?.uid || scannedData?.CitizenNo || scannedData?.pid || scannedData?.id || '',
        phone: '',
        nationality: idType === 'thai_id' ? 'THA' : (scannedData?.nationality || ''),
        licensePlate: ''
    });

    const [showKeyboard, setShowKeyboard] = useState(false);
    const [activeField, setActiveField] = useState<keyof typeof formData | null>(null);
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

    const isFormValid = formData.firstName.trim() !== '' &&
        formData.lastName.trim() !== '' &&
        formData.idNumber.trim() !== '' &&
        formData.phone.trim().length === 10;

    const handleInputFocus = (field: keyof typeof formData, e?: React.FocusEvent<HTMLInputElement>) => {
        setActiveField(field);
        setTouchedFields(prev => ({ ...prev, [field]: true }));
        setShowKeyboard(true);
        // Scroll element into view with delay to allow keyboard to appear
        if (e) {
            setTimeout(() => {
                e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    };

    const handleKeyPress = (key: string) => {
        if (!activeField) return;

        if ((activeField === 'idNumber' || activeField === 'phone') && key !== 'ENTER' && key !== 'BACKSPACE') {
            if (!/^[0-9]$/.test(key)) return;
        }

        if (key === 'ENTER') {
            setShowKeyboard(false);
            setActiveField(null);
        } else if (key === 'BACKSPACE') {
            setFormData(prev => ({
                ...prev,
                [activeField]: prev[activeField].slice(0, -1)
            }));
        } else if (key === 'SPACE') {
            if (activeField === 'idNumber' || activeField === 'phone') return;

            setFormData(prev => ({
                ...prev,
                [activeField]: prev[activeField] + ' '
            }));
        } else {
            setFormData(prev => {
                let currentVal = prev[activeField];
                // Strict length check for phone (10 digits max)
                if (activeField === 'phone' && currentVal.length >= 10) {
                    return prev;
                }

                let newVal = currentVal + key;
                return {
                    ...prev,
                    [activeField]: newVal
                };
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'phone' || name === 'idNumber') {
            if (!/^\d*$/.test(value)) return;
        }

        let finalValue = value;
        if (name === 'phone') {
            if (finalValue.length > 10) {
                finalValue = finalValue.substring(0, 10);
            }
        }

        setFormData({ ...formData, [name]: finalValue });
    };

    const handleSubmit = () => {
        navigate('/payment', {
            state: {
                ...location.state,
                formData,
                bookingCode
            }
        });
    };

    return (
        <Layout
            showBackButton={true}
            onBack={() => navigate(-1)}
            showGlobalLogo={false}
        >
            <div className="absolute inset-0 w-full h-full bg-slate-100 flex flex-col">

                {/* --- BODY: Everything scrolls together (Logo, Title, Form) --- */}
                <div className="flex-1 overflow-y-auto w-full flex flex-col items-center no-scrollbar pb-10 pt-24">

                    <div className="text-center mb-10 shrink-0 mt-8 flex flex-col items-center">
                        <Logo className="w-56 h-auto object-contain opacity-80 mb-10" />
                        <h1 className="text-7xl font-light text-gray-700 mb-6">{t('customer_info_title')}</h1>
                        <p className="text-4xl text-gray-400">{t('customer_info_desc')}</p>
                    </div>

                    <div className={`w-full max-w-[1000px] bg-slate-100 rounded-[4rem] shadow-neu-out p-16 mb-10 animate-fade-in-up transition-all duration-500 shrink-0 ${showKeyboard ? 'pb-96' : ''}`}>

                        <div className="flex justify-center mb-12">
                            <div className="px-10 py-4 bg-blue-100 text-blue-800 rounded-full font-bold text-3xl uppercase tracking-wider">
                                {idType === 'thai_id' ? t('thai_id_card') : t('passport')}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-10">

                            <div className="col-span-1">
                                <label className="block text-gray-500 text-4xl mb-6 ml-4">{t('booking_code')} <span className="font-bold text-gray-700">{bookingCode}</span></label>
                            </div>

                            <div>
                                <label className="block text-gray-500 text-4xl mb-6 ml-4">{t('first_name')}</label>
                                <input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    onFocus={(e) => handleInputFocus('firstName', e)}
                                    placeholder={t('enter_first_name')}
                                    autoComplete="off"
                                    className={`w-full h-32 bg-slate-50 rounded-[2rem] shadow-neu-in px-10 text-5xl text-gray-700 outline-none placeholder:text-gray-300 transition-all focus:ring-4 ${touchedFields.firstName && formData.firstName.trim() === '' ? 'ring-4 ring-red-400 focus:ring-red-400' : activeField === 'firstName' ? 'ring-4 ring-blue-400 focus:ring-blue-400' : ''}`}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-500 text-4xl mb-6 ml-4">{t('last_name')}</label>
                                <input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    onFocus={(e) => handleInputFocus('lastName', e)}
                                    placeholder={t('enter_last_name')}
                                    autoComplete="off"
                                    className={`w-full h-32 bg-slate-50 rounded-[2rem] shadow-neu-in px-10 text-5xl text-gray-700 outline-none placeholder:text-gray-300 transition-all focus:ring-4 ${touchedFields.lastName && formData.lastName.trim() === '' ? 'ring-4 ring-red-400 focus:ring-red-400' : activeField === 'lastName' ? 'ring-4 ring-blue-400 focus:ring-blue-400' : ''}`}
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-gray-500 text-4xl mb-6 ml-4">
                                    {idType === 'thai_id' ? t('national_id_number') : t('passport_number')}
                                </label>
                                <input
                                    name="idNumber"
                                    value={formData.idNumber}
                                    onChange={handleChange}
                                    onFocus={(e) => handleInputFocus('idNumber', e)}
                                    placeholder={idType === 'thai_id' ? 'x-xxxx-xxxxx-xx-x' : t('enter_passport_number')}
                                    autoComplete="off"
                                    className={`w-full h-32 bg-slate-50 rounded-[2rem] shadow-neu-in px-10 text-5xl text-gray-700 outline-none placeholder:text-gray-300 transition-all focus:ring-4 ${touchedFields.idNumber && formData.idNumber.trim() === '' ? 'ring-4 ring-red-400 focus:ring-red-400' : activeField === 'idNumber' ? 'ring-4 ring-blue-400 focus:ring-blue-400' : ''}`}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-500 text-4xl mb-6 ml-4">{t('phone_number')}</label>
                                <div className={`flex items-center w-full h-32 bg-slate-50 rounded-[2rem] shadow-neu-in px-10 overflow-hidden transition-all focus-within:ring-4 ${touchedFields.phone && formData.phone.length < 10 ? 'ring-4 ring-red-400 focus-within:ring-red-400' : activeField === 'phone' ? 'ring-4 ring-blue-400 focus-within:ring-blue-400' : ''}`}>
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        onFocus={(e) => handleInputFocus('phone', e)}
                                        placeholder="0xx-xxx-xxxx"
                                        maxLength={10}
                                        autoComplete="off"
                                        className="w-full h-full bg-transparent text-5xl text-gray-700 outline-none placeholder:text-gray-300"
                                    />
                                </div>
                                {touchedFields.phone && formData.phone.length > 0 && formData.phone.length < 10 && (
                                    <p className="text-red-500 text-2xl mt-4 ml-6">{t('enter_remaining_digits')}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-500 text-4xl mb-6 ml-4">{t('license_plate')}</label>
                                <input
                                    name="licensePlate"
                                    value={formData.licensePlate || ''}
                                    onChange={handleChange}
                                    onFocus={(e) => handleInputFocus('licensePlate', e)}
                                    placeholder={t('enter_license_plate')}
                                    autoComplete="off"
                                    className={`w-full h-32 bg-slate-50 rounded-[2rem] shadow-neu-in px-10 text-5xl text-gray-700 outline-none placeholder:text-gray-300 transition-all focus:ring-4 ${activeField === 'licensePlate' ? 'ring-4 ring-blue-400 focus:ring-blue-400' : ''}`}
                                />
                            </div>

                        </div>

                        <div className="flex gap-12 mt-20 justify-center">
                            <button
                                onClick={() => navigate('/room-selection')}
                                className="relative overflow-hidden px-20 py-10 rounded-full bg-slate-100 shadow-neu-out text-gray-500 text-4xl font-bold hover:text-gray-700 active:shadow-neu-in transition-all"
                            >
                                <Ripple />
                                <span className="relative z-10">{t('cancel')}</span>
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!isFormValid}
                                className={`relative overflow-hidden px-20 py-10 rounded-full text-white text-4xl font-bold shadow-lg transition-all ${isFormValid
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-xl hover:scale-105 cursor-pointer'
                                    : 'bg-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                <Ripple />
                                <span className="relative z-10">{t('submit')}</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-8 text-gray-400 text-sm font-light pb-40">
                        <span>{t('secure')}</span>
                        <span>•</span>
                        <span>{t('easy')}</span>
                        <span>•</span>
                        <span>{t('service_24h')}</span>
                    </div>

                    {showKeyboard && (
                        <VirtualKeyboard
                            onKeyPress={handleKeyPress}
                            onClose={() => {
                                setShowKeyboard(false);
                                setActiveField(null);
                            }}
                        />
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default CustomerInfo;
