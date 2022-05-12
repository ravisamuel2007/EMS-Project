import { LightningElement,track } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {NavigationMixin} from "lightning/navigation";
import utilities from 'c/emsUtilities';
import loginApplicant from '@salesforce/apex/EMS_ApplicantRegistrationController.loginApplicant';
export default class EmsApplicantLogin extends NavigationMixin(LightningElement) {

    applicantInfo = {}
    

    handleValueChange(event){
        let ts = this;
        ts.applicantInfo[event.target.name] = event.target.value;
    }

    handleLoginClick(){
        let ts = this;
        loginApplicant({loginCredentials : ts.applicantInfo})
        .then(result => {
            console.log(result);
            switch (result) {
                case 'home':
                    ts.showNotification(utilities.NOTIFICATION_HEADERS.SUCCESS, utilities.NOTIFICATIONS.LOGIN_SUCCESS, utilities.NOTIFICATION_TYPES.SUCCESS, utilities.NOTIFICATION_TYPES.DISMISSIBLE);
                    ts.navigateToPage(utilities.COMMUNITY_PAGES.COMM_NAMED_PAGE, utilities.COMMUNITY_PAGES.APPLICANT_PAGE);
                    break;
                case 'applicant_page':
                    ts.showNotification(utilities.NOTIFICATION_HEADERS.SUCCESS, utilities.NOTIFICATIONS.LOGIN_SUCCESS, utilities.NOTIFICATION_TYPES.SUCCESS, utilities.NOTIFICATION_TYPES.DISMISSIBLE);
                    ts.navigateToPage(utilities.COMMUNITY_PAGES.COMM_NAMED_PAGE, utilities.COMMUNITY_PAGES.APPLICANT_PAGE);
                    break;
                case 'verify_otp':
                    ts.showNotification(utilities.NOTIFICATION_HEADERS.ALERT, utilities.NOTIFICATIONS.VERIFY_OTP,  utilities.NOTIFICATION_TYPES.WARNING, utilities.NOTIFICATION_TYPES.DISMISSIBLE);
                    ts.dispatchCustomEvenint(utilities.EVENT_TYPES.OTP, {type : utilities.EVENT_TYPES.OTP, applicantEmail : ts.applicantInfo.email});
                    break;
                case 'authentication_failed':
                    ts.showNotification(utilities.NOTIFICATION_HEADERS.ERROR, utilities.NOTIFICATIONS.INVALID_CREDENTIALS, utilities.NOTIFICATION_TYPES.ERROR, utilities.NOTIFICATION_TYPES.DISMISSIBLE);
                    break;
                default:
                    break;
            }
           
        })
        .catch(error => {
            console.log(error)
        })
    }

    handleRegisterClick(){
        let ts = this;
        ts.dispatchCustomEvenint('registration', {type : 'registration'});
    }

    dispatchCustomEvenint(eventName, detail){
        let ts = this;
        ts.dispatchEvent(new CustomEvent(eventName, { detail: detail }));
    }

    validateApplicantInfo(){
        
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
    @track isModalOpen = false;
    openModal() {
        this.isModalOpen = true;
    }
    closeModal() {
        this.isModalOpen = false;
    }
    submitDetails() {
        this.isModalOpen = false;
    }

}