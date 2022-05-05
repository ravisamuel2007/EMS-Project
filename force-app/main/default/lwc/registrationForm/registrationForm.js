import { LightningElement } from 'lwc';
import createEventParticipant from "@salesforce/apex/registrationHandler.createEventParticipant";
export default class RegistrationForm extends LightningElement {
    showAlert = false;
    ShowSuccess = false;
    showForm = true;
    showSpinner = false;
    registrationHandler(event){
        this.errorMessage = "";
        this.showSpinner = true;
        let firstName = this.getFirstName();
        let lastName = this.getLastName();
        let email = this.getEmail();
        let companyName = this.getCompanyName();
        let linkedInUrl = this.getLinkedIn();
        let phoneNumber = this.getPhoneNumber();
        if(this.checkValidity([firstName,lastName,email,companyName,linkedInUrl,phoneNumber])){
            const participantData = { "firstName":firstName.value,"lastName":lastName.value,"email":email.value,"companyName":companyName.value,"linkedInUrl":linkedInUrl.value, "phoneNumber" : phoneNumber.value }
            createEventParticipant({ data: participantData }).then(()=>{
                this.registrationSuccess();
            }).catch(()=>{
                this.showSpinner = false;
                this.showError("Registration Failed , Please Try Again Later");
            })
        }else{
            this.showSpinner = false;
            this.showError("Please Enter Correct Information");
            
        }
    }
    getFirstName(){
        return this.template.querySelector('[data-element="firstName"]');
    }
    getLastName(){
        return this.template.querySelector('[data-element="lastName"]');
    }
    getEmail(){
        return this.template.querySelector('[data-element="email"]');
    }
    getCompanyName(){
        return this.template.querySelector('[data-element="company"]');
    }
    getLinkedIn(){
        return this.template.querySelector('[data-element="linkedIn"]');
    }
    getPhoneNumber(){
        return this.template.querySelector('[data-element="phone"]');
    }

    checkValidity(listOfElements){
        console.log(listOfElements);
        return listOfElements.reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
          }, true);
    }

    showError(errorMessage) {
        this.template.querySelector('[data-id="registerBlock"]').className =
          "shake-horizontal";
        this.errorMessage = errorMessage;
        this.showAlert = true;
      }
      closeAlert(event) {
        this.template
          .querySelector('[data-id="registerBlock"]')
          .classList.remove("shake-horizontal");
        this.showAlert = false;
      }
      registrationSuccess(){
        this.showSpinner = false;
          this.ShowSuccess = true;
          this.showForm = false;
      }
}