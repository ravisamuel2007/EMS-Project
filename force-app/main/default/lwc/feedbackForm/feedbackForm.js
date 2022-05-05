import { LightningElement } from 'lwc';
import createEventParticipant from "@salesforce/apex/FeedbackFormHandler.createFeedback";
export default class FeedbackForm extends LightningElement {
    showAlert = false;
    ShowSuccess = false;
    showForm = true;
    feedbackHandler(event){
        this.errorMessage = "";

        let Name = this.getName();
        let Email = this.getEmail();
        let Phone = this.getPhone();
        let Role= this.getRole();
        let Recommend = this.getRecommend();
        let Event_Favorite = this.getEvent_Favorite();
        let Experience = this.getExperience();
        let Future_Prospect = this.getFuture_Prospect();
        let Goodies = this.getGoodies();
        let remark = this.getremark();
        if(this.checkValidity([Name,Email,Phone,Role,Recommend,Event_Favorite,Experience,Future_Prospect,Goodies,remark])){
            console.log('inside method');
            const participantData = {"Name":Name.value,"Email":Email.value,"Phone":Phone.value,"Role":Role.value,"Recommend":Recommend.value,"Event_Favorite":Event_Favorite.value,"Experience":Experience.value,"Future_Prospect":Future_Prospect.value,"Goodies":Goodies.value,"remark":remark.value }
            createEventParticipant({ data: participantData }).then(()=>{
                this.registrationSuccess();
                console.log('inside success');
            }).catch(()=>{
                this.showError("Feedback Failed , Please Try Again Later  "+ this.errorMessage);
                console.log('inside failure message' + this.errorMessage );
            })
        }else{
            this.showSpinner = false;
            this.showError("Please Enter Correct Information");
        }
       
    }
    getName(){
        return this.template.querySelector('[data-element="Name"]');
    }
    getEmail(){
        return this.template.querySelector('[data-element="Email"]');
    }
    getPhone(){
        return this.template.querySelector('[data-element="Phone"]');
    }
    getRole(){
        return this.template.querySelector('[data-element="Role"]');
    }
    getRecommend(){
        return this.template.querySelector('[data-element="Recommend"]');
    }
    getEvent_Favorite(){
        return this.template.querySelector('[data-element="Event_Favorite"]');
    }
    getExperience(){
        return this.template.querySelector('[data-element="Experience"]');
    }
    getFuture_Prospect(){
        return this.template.querySelector('[data-element="Future_Prospect"]');
    }
    getGoodies(){
        return this.template.querySelector('[data-element="Goodies"]');
    }
    getremark(){
        return this.template.querySelector('[data-element="remark"]');
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
          this.ShowSuccess = true;
          this.showForm = false;
      }
    }