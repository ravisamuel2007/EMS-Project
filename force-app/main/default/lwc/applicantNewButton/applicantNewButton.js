import { LightningElement, track, api } from 'lwc';
import EMS_Applicant__c_OBJECT from '@salesforce/schema/EMS_Applicant__c';
/*import Name from '@salesforce/schema/EMS_Applicant__c.Name';
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
import LastModifiedById from '@salesforce/schema/EMS_Applicant__c.LastModifiedById';*/
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';


export default class ApplicantNewButton extends NavigationMixin(LightningElement) {
    customHideModalPopup() {
        this.customFormModal = false;
console.log('Im here');
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'EMS_Applicant__c',
                actionName: 'home'
            }
        });
        console.log('Im ended');
    }
    @track customFormModal = true;
   // @api recordId;
    EMS_Applicant = EMS_Applicant__c_OBJECT;
   /* myFields = [Name, EMS_First_Name__c, EMS_Last_Name__c, CheckUserMail__c, EMS_Skills__c, OwnerId, EMS_Previous_Company_Name__c, EMS_Technology__c,
        EMS_Phone_Number__c, EMS_Preferred_Location__c, EMS_Education__c, EMS_College__c, EMS_University__c, Experience_Years__c, EMS_Experience__c,
        CreatedById, Experience_Months__c, LastModifiedById];*/
    handleSuccess(event) {
        console.log('onsuccess event recordEditForm', event.detail.id)
        this.recordId = event.detail.id;
        const lwcInputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (lwcInputFields) {
            lwcInputFields.forEach(field => {
                field.reset();
            });
        }
        const toastEvent = new ShowToastEvent({
            title: 'Success!',
            message: 'Record Created successfully',
            variant: 'success'
        });
        // this.customFormModal = false;
        this.dispatchEvent(toastEvent);
        this.customHideModalPopup();
        /* this[NavigationMixin.Navigate]({
             
               type: 'standard__objectPage',
               attributes: {
                  recordId: event.detail.id,
                   actionName: "view",
               },
           });*/
           

    }
    handleSubmit(event) {
        console.log('onsubmit event recordEditForm' + JSON.stringify(event.detail));
        console.log(this.EMS_Applicant);

       
    }

}