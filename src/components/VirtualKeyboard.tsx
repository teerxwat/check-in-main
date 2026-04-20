import React, { useState } from 'react';

interface VirtualKeyboardProps {
    onKeyPress: (key: string) => void;
    onClose: () => void;
}

const layouts = {
    en: {
        normal: [
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['z', 'x', 'c', 'v', 'b', 'n', 'm', '@', '.']
        ],
        shift: [
            ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '?', '!']
        ]
    },
    th: {
        normal: [
            ['_', '/', '-', 'ภ', 'ถ', 'ุ', 'ึ', 'ค', 'ต', 'จ', 'ข', 'ช'],
            ['ๆ', 'ไ', 'ำ', 'พ', 'ะ', 'ั', 'ี', 'ร', 'น', 'ย', 'บ', 'ล'],
            ['ฟ', 'ห', 'ก', 'ด', 'เ', '้', '่', 'า', 'ส', 'ว', 'ง'],
            ['ผ', 'ป', 'แ', 'อ', 'ิ', 'ื', 'ท', 'ม', 'ใ', 'ฝ']
        ],
        shift: [
            ['%', '๑', '๒', '๓', '๔', 'ู', '฿', '๕', '๖', '๗', '๘', '๙'],
            ['๐', '"', 'ฎ', 'ฑ', 'ธ', 'ํ', '๊', 'ณ', 'ฯ', 'ญ', 'ฐ', ','],
            ['ฤ', 'ฆ', 'ฏ', 'โ', 'ฌ', '็', '๋', 'ษ', 'ศ', 'ซ', '.'],
            ['(', ')', 'ฉ', 'ฮ', 'ฺ', '์', '?', 'ฒ', 'ฬ', 'ฦ']
        ]
    }
};

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onKeyPress, onClose }) => {
    const [language, setLanguage] = useState<'en' | 'th'>('en');
    const [isShift, setIsShift] = useState(false);

    const currentLayout = layouts[language][isShift ? 'shift' : 'normal'];

    const handleKeyClick = (key: string) => {
        onKeyPress(key);

    };

    return (
        <div className="fixed bottom-12 left-0 w-full bg-slate-200 p-4 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 animate-slide-up border-t-4 border-white/50">
            <div className="flex justify-end mb-2 px-4">
                <button
                    onClick={onClose}
                    className="w-14 h-14 rounded-full bg-slate-200 shadow-neu-out flex items-center justify-center text-gray-500 hover:text-red-500 active:shadow-neu-in transition-all"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-[1040px] mx-auto pb-8">
                {currentLayout.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-2">
                        {row.map((key) => (
                            <button
                                key={key}
                                onClick={() => handleKeyClick(key)}
                                className={`
                                    h-28 ${language === 'th' ? 'w-[5.2rem]' : 'w-[6.2rem]'}
                                    bg-slate-100 rounded-[1.5rem] shadow-neu-out 
                                    text-6xl font-bold text-gray-700 
                                    hover:bg-white hover:text-blue-600 active:shadow-neu-in active:scale-95 
                                    transition-all flex items-center justify-center select-none
                                `}
                            >
                                {key}
                            </button>
                        ))}
                    </div>
                ))}


                <div className="flex justify-center gap-3 mt-4">
                    <button
                        onClick={() => setIsShift(!isShift)}
                        className={`
                            h-28 w-40 rounded-[1.5rem] shadow-neu-out font-bold text-3xl
                            flex items-center justify-center transition-all select-none
                            ${isShift ? 'bg-blue-100 text-blue-600 shadow-neu-in' : 'bg-slate-100 text-gray-600'}
                        `}
                    >
                        {isShift ? 'SHIFT' : 'shift'}
                    </button>

                    <button
                        onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
                        className="h-28 w-40 rounded-[1.5rem] bg-slate-100 shadow-neu-out font-bold text-3xl text-gray-600 hover:text-blue-600 active:shadow-neu-in transition-all select-none"
                    >
                        {language === 'en' ? 'TH' : 'EN'}
                    </button>

                    <button
                        onClick={() => handleKeyClick('SPACE')}
                        className="h-28 flex-1 max-w-2xl rounded-[1.5rem] bg-slate-100 shadow-neu-out font-bold text-3xl text-gray-600 hover:text-blue-600 active:shadow-neu-in transition-all select-none"
                    >
                        SPACE
                    </button>

                    <button
                        onClick={() => handleKeyClick('BACKSPACE')}
                        className="h-28 w-40 rounded-[1.5rem] bg-slate-100 shadow-neu-out text-gray-600 hover:text-red-500 active:shadow-neu-in transition-all flex items-center justify-center select-none"
                    >
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" /></svg>
                    </button>

                    <button
                        onClick={() => handleKeyClick('ENTER')}
                        className="h-28 w-48 rounded-[1.5rem] bg-blue-600 shadow-lg text-white font-bold text-3xl hover:bg-blue-500 active:scale-95 transition-all flex items-center justify-center select-none"
                    >
                        DONE
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default VirtualKeyboard;
