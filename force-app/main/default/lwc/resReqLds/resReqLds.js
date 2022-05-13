import { LightningElement, track, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import getJobDescription from '@salesforce/apex/ResReqLds.getJobDescription';
/*import EMS_Applicant__c_OBJECT from '@salesforce/schema/EMS_Applicant__c';
import EMS_Resource_Request__c_OBJECT from '@salesforce/schema/EMS_Resource_Request__c';
import EMS_Requirement_Title__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Requirement_Title__c';
import EMS_Project_Id__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Project_Id__c';
import EMS_Industry__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Industry__c';
import EMS_Domain_Technology__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Domain_Technology__c';
import EMS_Job_Role__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Job_Role__c';
import EMS_Vacant_Positions__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Vacant_Positions__c';
import EMS_Manager__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Manager__c';
import EMS_Resource_Type__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Resource_Type__c';
import EMS_Years__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Years__c';
import EMS_Job_Location__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Job_Location__c';
import EMS_Key_Skills__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Key_Skills__c';
import EMS_Required_Qualification__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Required_Qualification__c';
import EMS_Nice_to_Have_Skills__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Nice_to_Have_Skills__c';
import EMS_Other_Job_Role__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Other_Job_Role__c';*/

export default class ResReqLds extends NavigationMixin(LightningElement) {
    @track customFormModal = true;
    displayOtherJobRole = false;
    displayOtherNiceToHaveSkills = false;
    displayJD = false;
    displayRoleAndResp = false;
    departmentOptions;   
    domainOptions;       
    jobRoleOptions;
    @track JDData;
    @track RolesAndRespData;
    @track error;

    customHideModalPopup() {
        this.customFormModal = false;
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'EMS_Resource_Request__c',
                actionName: 'home'
            }
        });
    }

    handleSuccess(event) {
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
        this.dispatchEvent(toastEvent);
        this.customHideModalPopup();   

    }
    handleSubmit(event) {
        console.log('onsubmit event recordEditForm' + JSON.stringify(event.detail));
    }

    handleDepartment(event){
        this.departmentOptions = event.target.value;
    }

    handleDomain(event){
        this.domainOptions = event.target.value;
    }

    handleJobRole(event){
        this.EMS_Job_Role__c = event.target.value;
        this.jobRoleOptions = event.target.value;
       
        if(event.target.value == 'Other'){
            this.displayOtherJobRole = true;
            this.wiredJDData();
        }else{
            this.displayOtherJobRole = false;
        }
    }
    
    @wire(getJobDescription, {department: '$departmentOptions', domain: '$domainOptions', jobRole: '$jobRoleOptions'})
    wiredJDData({ error, data }) {
        if (data) {
            this.displayJD = true;
            this.displayRoleAndResp = true;
            this.JDData = data;
            this.RolesAndRespData = data;
            this.error = undefined;
            console.log('JD Data -->' + this.JDData);
            console.log('data-->' + JSON.stringify(data));
        } else if (error) {
            this.displayJD = false;
            this.displayRoleAndResp = false;
            this.error = error;
            this.JDData = undefined;
            this.RolesAndRespData = undefined;
        }
    }

    handleNicetoHaveSkills(event){
        this.EMS_Nice_to_Have_Skills__c = event.target.value;
        if(event.target.value == 'Other'){
            this.displayOtherNiceToHaveSkills = true;
        }else{
            this.displayOtherNiceToHaveSkills = false;
        }
        
    }

}