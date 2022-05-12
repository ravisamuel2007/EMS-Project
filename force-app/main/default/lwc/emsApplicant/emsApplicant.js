import { LightningElement } from 'lwc';

export default class EmsApplicant extends LightningElement {
    showLogin = true;
    showRegistration = false;
    showOtp = false;
    applicantEmail;
    handleApplicantEvent(event){
        let ts = this;
        let detail = event.detail;
        switch (detail.type) {
            case 'registration':
                ts.displayForms(false,true,false);
                break;
            case 'login' : 
                ts.displayForms(true,false,false);
                break;
            case 'otp':
                ts.applicantEmail = detail.applicantEmail;
                ts.displayForms(false,false,true);
            default:
                break;
        }
    }

    displayForms(showLogin, showRegistration, showOtp){
        let ts = this;

        ts.showLogin = showLogin;
        ts.showRegistration = showRegistration;
        ts.showOtp = showOtp
    }
}