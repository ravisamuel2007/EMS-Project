import { LightningElement, api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {NavigationMixin} from "lightning/navigation";
import utilities from 'c/emsUtilities';
import verifyOTP from '@salesforce/apex/EMS_ApplicantRegistrationController.verifyOTP';

export default class EmsApplicantOtp extends NavigationMixin(LightningElement) {
    @api applicantEmail;


    handleValueChange(event){
        let ts = this;
        ts.otp = event.detail.value;
    }

    handleVerifyClick(){
        let ts = this;
        verifyOTP({otp : ts.otp, email : ts.applicantEmail})
        .then(result => {
            if(result){
                ts.showNotification(utilities.NOTIFICATION_HEADERS.SUCCESS, utilities.NOTIFICATIONS.OTP_VERIFIED, utilities.NOTIFICATION_TYPES.SUCCESS, utilities.NOTIFICATION_TYPES.DISMISSIBLE);
                ts.navigateToPage(utilities.COMMUNITY_PAGES.COMM_NAMED_PAGE, utilities.COMMUNITY_PAGES.APPLICANT_PAGE);
            }
            else{
                ts.showNotification(utilities.NOTIFICATION_HEADERS.ERROR, utilities.NOTIFICATIONS.INVALID_OTP, utilities.NOTIFICATION_TYPES.ERROR, utilities.NOTIFICATION_TYPES.DISMISSIBLE);
            }
        })
        .catch(error =>{
            console.log(error);
            ts.showNotification(utilities.NOTIFICATION_HEADERS.ERROR, utilities.NOTIFICATIONS.SOMETHING_WENT_WRONG, utilities.NOTIFICATION_TYPES.ERROR, utilities.NOTIFICATION_TYPES.DISMISSIBLE);
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
}