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
            //redirct to otp screen
        })
        .catch(error => {
            console.log(error);
        })
    }

    handleLoginClick(){
        let ts = this;
       // ts.navigateToPage('comm__namedPage', 'ems_login__c');
       ts.dispatchEvent(new CustomEvent('login', { detail: 'login' }));
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
        const evt = new ShowToastEvent({
            title : title,
            message : message,
            variant : variant,
            mode : mode
        });

        this.dispatchEvent(evt);
    }
}