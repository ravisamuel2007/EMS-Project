import { LightningElement } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {NavigationMixin} from "lightning/navigation";

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
            if(result){
                //redirect to home/profile page
                ts.showNotification('Success', 'Login Sucess', 'success', 'dismissible');
                ts.navigateToPage('comm__namedPage', 'home');
            }
            else{
                //throw error
                ts.showNotification('Error', 'Invalid Credentials', 'error', 'dismissible');
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    handleRegisterClick(){

        try{
        let ts = this;
        ts.dispatchEvent(new CustomEvent('registration', { detail: 'registration' }));
        }
        catch(e){
            console.log(e)
        }
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