import { LightningElement,track } from 'lwc';
import Name from '@salesforce/schema/EMS_Applicant__c.Name';
import EMS_First_Name__c from '@salesforce/schema/EMS_Applicant__c.EMS_First_Name__c';
import EMS_Last_Name__c from '@salesforce/schema/EMS_Applicant__c.EMS_Last_Name__c';
import CheckUserMail__c from '@salesforce/schema/EMS_Applicant__c.CheckUserMail__c';
import EMS_Skills__c from '@salesforce/schema/EMS_Applicant__c.EMS_Skills__c';
import OwnerId from '@salesforce/schema/EMS_Applicant__c.OwnerId';
import EMS_Previous_Company_Name__c from '@salesforce/schema/EMS_Applicant__c.EMS_Previous_Company_Name__c';
import EMS_Technology__c from '@salesforce/schema/EMS_Applicant__c.EMS_Technology__c';
import EMS_Phone_Number__c from '@salesforce/schema/EMS_Applicant__c.EMS_Phone_Number__c';
import EMS_Preferred_Location__c from '@salesforce/schema/EMS_Applicant__c.EMS_Preferred_Location__c';
import EMS_Education__c from '@salesforce/schema/EMS_Applicant__c.EMS_Education__c';
import EMS_College__c from '@salesforce/schema/EMS_Applicant__c.EMS_College__c';
import EMS_University__c from '@salesforce/schema/EMS_Applicant__c.EMS_University__c';
import Experience_Years__c from '@salesforce/schema/EMS_Applicant__c.Experience_Years__c';
import EMS_Experience__c from '@salesforce/schema/EMS_Applicant__c.EMS_Experience__c';
import CreatedById from '@salesforce/schema/EMS_Applicant__c.CreatedById';
import Experience_Months__c from '@salesforce/schema/EMS_Applicant__c.Experience_Months__c';
import LastModifiedById from '@salesforce/schema/EMS_Applicant__c.LastModifiedById';


export default class newApplicantQuickaction extends LightningElement {
    Name=Name;
    FirstName=EMS_First_Name__c;
    LastName=EMS_Last_Name__c;
    CheckUserMail=CheckUserMail__c;
    EMSSkills=EMS_Skills__c;
    Owner=OwnerId;
    PreviousCompanyName=EMS_Previous_Company_Name__c;
    EMSTechnology=EMS_Technology__c;
    EMSPhoneNumber=EMS_Phone_Number__c;
    EMSPreferredLocation=EMS_Preferred_Location__c;
    EMSEducation=EMS_Education__c;
    EMSCollege=EMS_College__c;
    EMSUniversity=EMS_University__c;
    ExperienceYears=Experience_Years__c;
    EMSExperience=EMS_Experience__c;
    CreatedById=CreatedById;
    ExperienceMonths=Experience_Months__c;
    LastModifiedById=LastModifiedById;


    @track EditFormModal = false;

    EditShowModalPopup() {
        this.EditFormModal = true;

    }

    EditHideModalPopup() {

        this.EditFormModal = false;
    }
    handleSuccess(){
        if(this.recordId !== null){
            this.dispatchEvent(new ShowToastEvent({
                    title: "SUCCESS!",
                    message: "New record has been created.",
                   variant: "success",
                }),  
           );    
         }
    } 

    handleSubmit(event) {
        console.log('onsubmit event recordEditForm' + event.detail.fields);

    }
    EditHidesaveModalPopup(event) {
        //console.log('checked ' + this.selectedCandidateRow);
        this.EditHideModalPopup();
        window.location.reload();
      //  return refreshApex(this.result);


}
}