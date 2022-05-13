import { LightningElement } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {NavigationMixin} from "lightning/navigation";
import saveNewApplicant from '@salesforce/apex/EMS_ApplicantRegistrationController.saveNewApplicant';

export default class EmsApplicantRegistration extends NavigationMixin(LightningElement) {


    applicantInfo = {}
    handleValueChange(event){
        let ts = this;
        ts.applicantInfo[event.target.name] = event.target.value;
    }

    handleRegisterClick(){
        let ts = this;
        ts.applicantInfo.Full_Name__c = ts.applicantInfo.firstName + ts.applicantInfo.lastName;
        //validations
        
        saveNewApplicant({applicant : ts.applicantInfo})
        .then(() => {
            ts.showNotification('Success', 'Registration Sucess', 'success', 'dismissible');
            ts.dispatchCustomEvenint('otp', {type:'otp', applicantEmail : ts.applicantInfo.Email__c});
        })
        .catch(error => {
            console.log(error);
             ts.showNotification('Error', error.body.message, 'error', 'dismissible');
        })
    }

    handleLoginClick(){
        let ts = this;
        ts.dispatchCustomEvenint('login', {type : 'login'});
       
    }

    validateApplicantInfo(){

    }

    dispatchCustomEvenint(eventName, detail){
        let ts = this;
        ts.dispatchEvent(new CustomEvent(eventName, { detail: detail }));
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
        const evt = new ShowToastEvent({
            title : title,
            message : message,
            variant : variant,
            mode : mode
        });

        this.dispatchEvent(evt);
    }
}