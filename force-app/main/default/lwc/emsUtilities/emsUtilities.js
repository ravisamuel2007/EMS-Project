const NOTIFICATION_HEADERS = {SUCCESS : 'Success', ERROR : 'Error', ALERT : 'Alert'}
const NOTIFICATION_TYPES = {SUCCESS :'success', ERROR :'error', WARNING : 'warning', DISMISSIBLE : 'dismissible'}
const NOTIFICATIONS = {LOGIN_SUCCESS : 'Login Success', REGISTRATION_SUCCESS : 'Registration Sucess', OTP_VERIFIED : 'OTP Verified',
                        INVALID_CREDENTIALS : 'Invalid Credentials', INVALID_OTP : 'Invalid OTP',SOMETHING_WENT_WRONG :'Something went wrong',
                    EMAIL_SENT :'Email Sent Successfully',EMAIL_MISSING :'Email not Found, Please Register',
                    INVALID_OPT_ATEMPTS : 'Reached maximum attempts. Try Resend OTP'};
const COMMUNITY_PAGES = {COMM_NAMED_PAGE : 'comm__namedPage',APPLICANT_PAGE : 'applicant_page', HOME_PAGE : 'home', }

const EVENT_TYPES = {LOGIN : 'login', REGISTRATION : 'registration', OTP : 'otp'}
export {
    NOTIFICATION_HEADERS,
    NOTIFICATION_TYPES,
    NOTIFICATIONS,
    COMMUNITY_PAGES,
    EVENT_TYPES
}