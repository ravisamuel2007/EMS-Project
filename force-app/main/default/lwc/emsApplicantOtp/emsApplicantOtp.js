import { LightningElement, api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import verifyOTP from '@salesforce/apex/EMS_ApplicantRegistrationController.verifyOTP';

export default class EmsApplicantOtp extends LightningElement {
    @api applicantEmail;


    handleValueChange(event){
        let ts = this;
        ts.otp = event.detail.value;
    }

    handleVerifyClick(){
        let ts = this;
        console.log(ts.applicantEmail);
        verifyOTP({otp : ts.otp, email : ts.applicantEmail})
        .then(result => {
            
            if(result){
                ts.showNotification('Success', 'OTP Verified', 'success', 'dismissible');

            }
            else{
                ts.showNotification('Error', 'Invalid OTP', 'error', 'dismissible');
            }
        })
        .catch(error =>{
            console.log(error);
            ts.showNotification('Error', 'Something went wrong', 'error', 'dismissible');
        })

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