import { LightningElement, api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {NavigationMixin} from "lightning/navigation";
import utilities from 'c/emsUtilities';
import verifyOTP from '@salesforce/apex/EMS_ApplicantRegistrationController.verifyOTP';
import resendOTP from '@salesforce/apex/EMS_ApplicantRegistrationController.resendOTP';

export default class EmsApplicantOtp extends NavigationMixin(LightningElement) {
    @api applicantEmail;
    counter;
    invalidOTPAttempts = 5;
    disableResend = true;

    connectedCallback() {
        let ts = this;
        ts.enableResendOTP();
        ts.countdown(2, 0);
    }

    enableResendOTP(){
        let ts = this;
        setTimeout(function(){
            ts.disableResend = false;
        }, 120000);
    }

    handleValueChange(event){
        let ts = this;
        ts.otp = event.detail.value;
    }

    handleVerifyClick(){
        let ts = this;
        if(ts.invalidOTPAttempts > 0){
        verifyOTP({otp : ts.otp, email : ts.applicantEmail})
        .then(result => {
            if(result){
                ts.showNotification(utilities.NOTIFICATION_HEADERS.SUCCESS, utilities.NOTIFICATIONS.OTP_VERIFIED, utilities.NOTIFICATION_TYPES.SUCCESS, utilities.NOTIFICATION_TYPES.DISMISSIBLE);
                ts.navigateToPage(utilities.COMMUNITY_PAGES.COMM_NAMED_PAGE, utilities.COMMUNITY_PAGES.APPLICANT_PAGE);
            }
            else{
                ts.invalidOTPAttempts -= 1;
                ts.otp = '';
                ts.showNotification(utilities.NOTIFICATION_HEADERS.ERROR, utilities.NOTIFICATIONS.INVALID_OTP, utilities.NOTIFICATION_TYPES.ERROR, utilities.NOTIFICATION_TYPES.DISMISSIBLE);
            }
        })
        .catch(error =>{
            console.log(error);
            ts.showNotification(utilities.NOTIFICATION_HEADERS.ERROR, utilities.NOTIFICATIONS.SOMETHING_WENT_WRONG, utilities.NOTIFICATION_TYPES.ERROR, utilities.NOTIFICATION_TYPES.DISMISSIBLE);
        })
        }
        else{
            ts.showNotification(utilities.NOTIFICATION_HEADERS.ERROR, utilities.NOTIFICATIONS.INVALID_OPT_ATEMPTS, utilities.NOTIFICATION_TYPES.ERROR, utilities.NOTIFICATION_TYPES.DISMISSIBLE);
        }

    }

    handleResendClick(){
        let ts = this;
        resendOTP({email : ts.applicantEmail})
        .then(result => {
            ts.showNotification(utilities.NOTIFICATION_HEADERS.SUCCESS, utilities.NOTIFICATIONS.OTP_RESENT, utilities.NOTIFICATION_TYPES.SUCCESS, utilities.NOTIFICATION_TYPES.DISMISSIBLE);
            ts.disableResend = true;
            ts.invalidOTPAttempts = 5;
            ts.enableResendOTP();
            ts.countdown(2, 0);
        })
        .catch(error => {
            console.log(error)
        })
    }


    navigateToPage(type, name) {
        let ts = this;
        ts[NavigationMixin.Navigate]({
            type: type, 
            attributes: {
                name: name
          }
        });
    }

    showNotification(title, message, variant, mode){
        let ts = this;
        const evt = new ShowToastEvent({
            title : title,
            message : message,
            variant : variant,
            mode : mode
        });
        ts.dispatchEvent(evt);
    }

    countdown(minutes, seconds) {
        let ts = this;
        
        function tick() {
            ts.counter = 
            minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
            seconds--;
            if (seconds >= 0) {
                ts.timeoutHandle = setTimeout(tick, 1000);
            } else {
                if (minutes >= 1) {
                setTimeout(function () {
                    ts.countdown(minutes - 1, 59);
                }, 1000);
            }
        }
    }
    tick();
}
}