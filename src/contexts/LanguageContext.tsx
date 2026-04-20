import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'TH' | 'EN';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Record<string, Record<Language, string>> = {
    // General
    'welcome': { TH: 'ยินดีต้อนรับ', EN: 'WELCOME' },
    'select_language': { TH: 'กรุณาเลือกภาษา', EN: 'Please select your language' },
    'back': { TH: 'ย้อนกลับ', EN: 'Back' },
    'contact_staff': { TH: 'ติดต่อพนักงาน', EN: 'Contact Staff' },

    // Menu
    'check_in': { TH: 'เช็คอิน', EN: 'Check In' },
    'check_out': { TH: 'เช็คเอาท์', EN: 'Check Out' },
    'walk_in': { TH: 'ลูกค้า Walk-in', EN: 'Walk In Customer' },

    // Check-in
    // Check-in
    'find_booking': { TH: 'ค้นหาการจอง', EN: 'Find Booking' },
    'enter_booking_code': { TH: 'ระบุเลขที่การจอง', EN: 'Enter Booking Code' },
    'walk_in_action': { TH: 'วอล์คอิน / จองห้องพัก', EN: 'Walk-In' },
    'enter_booking_ref': { TH: 'กรุณากรอกหมายเลขการจอง', EN: 'Enter your booking reference number' },
    'search': { TH: 'ค้นหา', EN: 'SEARCH' },
    'scan_qr_email': { TH: 'สแกน QR จากอีเมล', EN: 'SCAN QR FROM EMAIL' },
    'booking_search_title': { TH: 'ค้นหาการจอง', EN: 'Booking Search' },
    'booking_not_found': {
        TH: 'ไม่พบข้อมูลการจองนี้\nกรุณาตรวจสอบหมายเลขอีกครั้ง',
        EN: 'Booking Not Found\nPlease check the number again'
    },
    'select_room_type': { TH: 'เลือกประเภทห้องพัก', EN: 'Select Room Type' },
    'choose_room_size': { TH: 'เลือกขนาดห้องที่คุณต้องการ', EN: 'Choose the room size that fits you' },
    'choose_room_number': { TH: 'เลือกหมายเลขห้องที่คุณต้องการ', EN: 'Choose your preferred room number' },
    'available': { TH: 'ว่าง', EN: 'Available' },
    'floor': { TH: 'ชั้น', EN: 'Floor' },
    'guests_label': { TH: 'ผู้เข้าพัก', EN: 'Guests' },
    'bed': { TH: 'เตียง', EN: 'Bed' },
    'no_rooms_available': { TH: 'ไม่มีห้องว่างสำหรับประเภทนี้', EN: 'No rooms available for this type.' },
    'full': { TH: 'เต็ม', EN: 'Full' },

    // Room Types & Beds (Data mapping)
    'Standard': { TH: 'ห้องมาตรฐาน', EN: 'Standard' },
    'Deluxe': { TH: 'ห้องดีลักซ์', EN: 'Deluxe' },
    'Family': { TH: 'ห้องสำหรับครอบครัว', EN: 'Family' },
    'Queen': { TH: 'ควีน', EN: 'Queen' },
    'King': { TH: 'คิง', EN: 'King' },
    'Twin': { TH: 'ทวิน', EN: 'Twin' },

    // Details
    'booking_details': { TH: 'รายละเอียดการจอง', EN: 'Booking Details' },
    'verify_info': { TH: 'กรุณาตรวจสอบข้อมูลของท่าน', EN: 'Please verify your information' },
    'guest_name': { TH: 'ชื่อผู้เข้าพัก', EN: 'Guest Name' },
    'confirm_scan': { TH: 'ยืนยันและสแกนบัตร', EN: 'CONFIRM & SCAN ID' },

    // ID Scan
    'id_verification': { TH: 'ยืนยันตัวตน', EN: 'Identity Verification' },
    'select_id_type': { TH: 'เลือกประเภทบัตร', EN: 'Select ID Type' },
    'scan_id_title': { TH: 'สแกนบัตรประชาชน', EN: 'Scan ID Card' },
    'scan_passport_title': { TH: 'สแกนพาสปอร์ต', EN: 'Scan Passport' },
    'insert_id': { TH: 'กรุณาเสียบบัตรประชาชน', EN: 'Please insert your ID Card' },
    'thai_id_card': { TH: 'บัตรประชาชน', EN: 'Thai ID Card' },
    'passport': { TH: 'พาสปอร์ต', EN: 'Passport' },
    'please_insert_thai_id': { TH: 'กรุณาเสียบบัตรประชาชนของท่าน', EN: 'Please insert your Thai ID Card' },
    'please_scan_passport': { TH: 'กรุณาสแกนพาสปอร์ตของท่าน', EN: 'Please scan your Passport' },
    'scanning': { TH: 'กำลังสแกน...', EN: 'Scanning...' },
    'verification_complete': { TH: 'ตรวจสอบเสร็จสิ้น', EN: 'Verification Complete' },
    'simulate_insert_id': { TH: 'จำลองการเสียบบัตร', EN: 'Simulate Insert ID' },
    'simulate_scan_passport': { TH: 'จำลองการสแกน', EN: 'Simulate Scan Passport' },

    // Payment
    'payment_summary': { TH: 'สรุปยอดชำระ', EN: 'Payment Summary' },
    'select_payment': { TH: 'เลือกช่องทางการชำระเงิน', EN: 'Select Payment Method' },
    'total': { TH: 'ยอดรวม', EN: 'Total' },

    // Key
    'encoding_key': { TH: 'กำลังบันทึกคีย์การ์ด...', EN: 'Encoding Key Card...' },
    'dispensing_key': { TH: 'กำลังจ่ายคีย์การ์ด...', EN: 'Dispensing Your Key...' },
    'check_in_complete': { TH: 'เช็คอินเสร็จสมบูรณ์!', EN: 'Check In Complete!' },
    'take_key': { TH: 'กรุณารับคีย์การ์ดด้านล่าง ขอให้มีความสุขกับการเข้าพัก', EN: 'Please take your key card below. Enjoy your stay!' },
    'back_home': { TH: 'กลับหน้าหลัก', EN: 'Back to Home' },

    // Check-out
    'checkout_room_search': { TH: 'เช็คเอาท์ - ระบุห้อง', EN: 'Check Out - Room Search' },
    'insert_key_check_out': { TH: 'กรุณาสอดคีย์การ์ดเพื่อเช็คเอาท์', EN: 'Please insert key card to check out' },
    'room_number': { TH: 'หมายเลขห้อง', EN: 'Room Number' },
    'outstanding_balance': { TH: 'ยอดค้างชำระ', EN: 'Outstanding Balance' },
    'no_outstanding': { TH: 'ไม่มียอดค้างชำระ', EN: 'No Outstanding Balance' },
    'confirm_checkout': { TH: 'ยืนยันการเช็คเอาท์', EN: 'Confirm Check Out' },
    'checkout_complete': { TH: 'เช็คเอาท์เสร็จสมบูรณ์', EN: 'Check Out Complete' },
    'thank_you': { TH: 'ขอบคุณที่ใช้บริการ', EN: 'Thank You & Safe Travels' },

    // Rating
    'rate_stay': { TH: 'ให้คะแนนการเข้าพัก', EN: 'Rate Your Stay' },
    'rate_desc': { TH: 'ความคิดเห็นของท่านสำคัญต่อการปรับปรุงบริการของเรา', EN: 'Your feedback helps us improve' },
    'submit_rating': { TH: 'ส่งความคิดเห็น', EN: 'Submit Review' },
    'skip_rating': { TH: 'ข้าม', EN: 'Skip' },
    'great': { TH: 'เยี่ยมมาก', EN: 'Excellent' },
    'good': { TH: 'ดี', EN: 'Good' },
    'okay': { TH: 'พอใช้', EN: 'Okay' },
    'bad': { TH: 'แย่', EN: 'Poor' },
    'what_would_you_like_to_do': { TH: 'เลือกรายการที่ต้องการ', EN: 'What would you like to do?' },
    'terrible': { TH: 'ต้องปรับปรุง', EN: 'Terrible' },
    'tag_cleanliness': { TH: 'ความสะอาด', EN: 'Cleanliness' },
    'tag_service': { TH: 'การบริการ', EN: 'Service' },
    'tag_facilities': { TH: 'สิ่งอำนวยความสะดวก', EN: 'Facilities' },
    'tag_value': { TH: 'ความคุ้มค่า', EN: 'Value' },
    'review_cleanliness': { TH: 'ความสะอาด', EN: 'Cleanliness' },
    'review_service': { TH: 'การบริการ', EN: 'Service' },
    'review_facilities': { TH: 'สิ่งอำนวยความสะดวก', EN: 'Facilities' },
    'review_check_in': { TH: 'ขั้นตอนการเช็คอิน', EN: 'Check-in Process' },
    'review_overall': { TH: 'ประสบการณ์โดยรวม', EN: 'Overall Experience' },
    'checkout_search_title': { TH: 'เช็คเอาท์', EN: 'Check Out' },
    'or_enter_room_number': { TH: 'หรือระบุเลขห้อง', EN: 'OR ENTER ROOM NUMBER' },
    'comment_placeholder': { TH: 'ข้อเสนอแนะเพิ่มเติม...', EN: 'Additional comments...' },
    'welcome_hotel': { TH: 'ยินดีต้อนรับสู่โรงแรมของเรา', EN: 'Welcome to Our Hotel' },
    'review_rules': { TH: 'กรุณาตรวจสอบสิ่งอำนวยความสะดวกและกฎระเบียบ', EN: 'Please review our facilities and house rules.' },
    'no_pets': { TH: 'ห้ามนำสัตว์เลี้ยงเข้าพัก', EN: 'No pets allowed' },
    'no_smoking': { TH: 'ห้ามสูบบุหรี่ในห้องพัก', EN: 'No smoking indoors' },
    'keep_quiet': { TH: 'กรุณางดใช้เสียงดังรบกวน', EN: 'Please keep noise to a minimum' },
    'agree_rules': { TH: 'ข้าพเจ้ายอมรับกฎระเบียบการเข้าพัก', EN: 'I agree to the hotel rules during my stay.' },
    'confirm_details': { TH: 'ยืนยันข้อมูล', EN: 'Confirm Details' },
    'i_agree': { TH: 'ยอมรับ', EN: 'I Agree' },
    'checkout_before_noon': { TH: 'เช็คเอาท์ก่อนเวลา 12.00 น.', EN: 'Check-out before 12:00 PM' },
    'hotel_info': { TH: 'ข้อมูลโรงแรม', EN: 'Hotel Info' },
    'tourist_info': { TH: 'สถานที่ท่องเที่ยว', EN: 'Tourist Info' },
    'nearby_dining': { TH: 'ร้านอาหารใกล้เคียง', EN: 'Nearby Dining' },

    // Customer Info
    'customer_info_title': { TH: 'ข้อมูลผู้เข้าพัก', EN: 'Customer Information' },
    'customer_info_desc': { TH: 'กรุณากรอกข้อมูลเพื่อทำการเช็คอิน', EN: 'Please enter details for check-in.' },
    'contact_info': { TH: 'ข้อมูลติดต่อ', EN: 'Contact Info' },
    'enter_contact_details': { TH: 'กรุณากรอกข้อมูลติดต่อของคุณ', EN: 'Please enter your contact details' },
    'invalid_phone': { TH: 'เบอร์โทรศัพท์ไม่ถูกต้อง', EN: 'Invalid phone number' },
    'optional': { TH: 'ไม่บังคับ', EN: 'Optional' },
    'next': { TH: 'ถัดไป', EN: 'Next' },
    'booking_code': { TH: 'รหัสการจอง', EN: 'Booking Code' },
    'first_name': { TH: 'ชื่อจริง', EN: 'First Name' },
    'last_name': { TH: 'นามสกุล', EN: 'Last Name' },
    'enter_first_name': { TH: 'กรอกชื่อจริง', EN: 'Enter first name' },
    'enter_last_name': { TH: 'กรอกนามสกุล', EN: 'Enter last name' },
    'national_id_number': { TH: 'เลขบัตรประชาชน', EN: 'National ID Number' },
    'passport_number': { TH: 'เลขพาสปอร์ต', EN: 'Passport Number' },
    'enter_passport_number': { TH: 'กรอกเลขพาสปอร์ต', EN: 'Enter passport number' },
    'phone_number': { TH: 'เบอร์โทรศัพท์', EN: 'Phone Number' },
    'enter_phone_number': { TH: 'กรุณากรอกเบอร์โทรศัพท์', EN: 'Please enter your phone number' },
    'enter_remaining_digits': { TH: '* กรุณากรอกให้ครบ 10 หลัก', EN: '* Please enter 10 digits' },
    'license_plate': { TH: 'ทะเบียนรถ (ถ้ามี)', EN: 'License Plate (Optional)' },
    'enter_license_plate': { TH: 'กรอกทะเบียนรถ', EN: 'Enter license plate' },
    'cancel': { TH: 'ยกเลิก', EN: 'Cancel' },
    'submit': { TH: 'ยืนยัน', EN: 'Submit' },
    'secure': { TH: 'ปลอดภัย', EN: 'Secure' },
    'easy': { TH: 'ง่ายดาย', EN: 'Easy' },
    'service_24h': { TH: 'บริการ 24 ชม.', EN: '24-Hour Service' },

    // Payment
    'room_charge': { TH: 'ค่าห้องพัก (1 คืน)', EN: 'Room Charge (1 Night)' },
    'service_charge': { TH: 'เซอร์วิสชาร์จ (10%)', EN: 'Service Charge (10%)' },
    'vat': { TH: 'ภาษีมูลค่าเพิ่ม (7%)', EN: 'VAT (7%)' },
    'credit_card': { TH: 'บัตรเครดิต', EN: 'Credit Card' },
    'scan_qr': { TH: 'สแกน QR', EN: 'Scan QR' },
    'promptpay': { TH: 'พร้อมเพย์', EN: 'PromptPay' },
    'scan_to_pay': { TH: 'สแกนเพื่อชำระเงิน', EN: 'Scan to Pay' },
    'waiting_for_payment': { TH: 'รอการชำระเงิน...', EN: 'Waiting for payment...' },
    'processing': { TH: 'กำลังดำเนินการ...', EN: 'Processing...' },
    'please_wait': { TH: 'กรุณารอสักครู่', EN: 'Please wait a moment' },
    'payment_successful': { TH: 'ชำระเงินเสร็จสมบูรณ์', EN: 'Payment Successful' },
    'redirecting': { TH: 'กำลังไปหน้าถัดไป...', EN: 'Redirecting...' },

    // Errors & Common
    'enter_room_number': { TH: 'ระบุหมายเลขห้อง', EN: 'Enter Room Number' },
    'room_no_placeholder': { TH: 'เลขห้อง', EN: 'ROOM NO.' },
    'system_error': { TH: 'เกิดข้อผิดพลาดในระบบ', EN: 'System Error' },
    'already_checked_in': { TH: 'เช็คอินแล้ว / มีการจองแล้ว', EN: 'Already Checked In / Booked' },
    'auto_return_home': { TH: 'กลับหน้าหลักอัตโนมัติใน', EN: 'Returning to home in' },

    // Batch 2 Keys
    'booking_no_placeholder': { TH: 'เลขที่การจอง', EN: 'BOOKING NO.' },
    'searching': { TH: 'กำลังค้นหา...', EN: 'Searching...' },
    'playing_video': { TH: 'กำลังเล่นวิดีโอ...', EN: 'Playing Video...' },

    // Amenities
    'amenity_restaurant': { TH: 'ห้องอาหาร', EN: 'Restaurant' },
    'amenity_restaurant_desc': { TH: 'เปิด 7:00 - 22:00', EN: 'Open 7:00 - 22:00' },
    'amenity_parking': { TH: 'ที่จอดรถ', EN: 'Parking' },
    'amenity_parking_desc': { TH: 'ฟรีสำหรับผู้เข้าพัก', EN: 'Free for guests' },
    'amenity_emergency': { TH: 'ฉุกเฉิน', EN: 'Emergency' },
    'amenity_emergency_desc': { TH: 'ตามป้ายทางออก', EN: 'Follow exit signs' },
    'amenity_stay_info': { TH: 'ข้อมูลการเข้าพัก', EN: 'Stay Info' },
    'amenity_stay_info_desc': { TH: 'แตะเพื่อดูข้อมูล', EN: 'Tap for more info' },

    // CheckOutBill Keys
    'guest_label': { TH: 'ผู้เข้าพัก', EN: 'Guest' },
    'customer_default': { TH: 'ลูกค้า', EN: 'Customer' },
    'room_charge_label': { TH: 'ค่าห้องพัก', EN: 'Room Charge' },
    'paid': { TH: 'ชำระแล้ว', EN: 'Paid' },
    'minibar_extra': { TH: 'มินิบาร์ / อื่นๆ', EN: 'Minibar / Extra' },

    // Booking Details
    'booking_ref_label': { TH: 'รหัสการจอง', EN: 'Booking Reference' },
    'room_type_label': { TH: 'ประเภทห้อง', EN: 'Room Type' },
    'duration_label': { TH: 'ระยะเวลา', EN: 'Duration' },
    'nights_label': { TH: 'คืน', EN: 'Night(s)' },
    'confirmed_status': { TH: 'ยืนยันแล้ว', EN: 'CONFIRMED' },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('TH');

    const t = (key: string) => {
        return translations[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
