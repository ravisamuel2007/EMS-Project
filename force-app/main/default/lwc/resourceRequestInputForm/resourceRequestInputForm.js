import { LightningElement,track,wire } from 'lwc';
    import saveRecord from '@salesforce/apex/ResourceRequestController.saveResourceRequestRecord';  
    import {ShowToastEvent} from 'lightning/platformShowToastEvent';
    import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
    import EMS_Resource_Request__c from '@salesforce/schema/EMS_Resource_Request__c'; 
    import pickListValueDynamically from '@salesforce/apex/ResourceRequestController.pickListValueDynamically';
    import fetchDependentPicklistValues from '@salesforce/apex/ResourceRequestController.fetchDependentPicklistValues';
    import saveResourceRequestRecord from '@salesforce/apex/ResourceRequestController.saveResourceRequestRecord';


    import EMS_Company_Information__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Company_Information__c';
    import EMS_Industry__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Industry__c';
    import EMS_Domain_Technology__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Domain_Technology__c';
    import EMS_Job_Description__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Job_Description__c';
    import EMS_Job_Location__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Job_Location__c';
    import EMS_Job_Role__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Job_Role__c';
    import EMS_Key_Skills__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Key_Skills__c';
    import EMS_Manager__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Manager__c';
    import EMS_Must_Have_Skills__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Must_Have_Skills__c';
    import EMS_Nice_to_Have_Skills__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Nice_to_Have_Skills__c';
    import EMS_Other_Job_Role__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Other_Job_Role__c';
    import EMS_Project_Id__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Project_Id__c';
    import EMS_Required_Qualification__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Required_Qualification__c';
    import EMS_Years__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Years__c';
    import EMS_Requirement_Title__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Requirement_Title__c';
    import EMS_Resource_Type__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Resource_Type__c';
    import EMS_Roles_and_Responsibilities__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Roles_and_Responsibilities__c';
    import EMS_Vacant_Positions__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Vacant_Positions__c';
    import EMS_Other_Nice_To_Have_Skills__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Other_Nice_To_Have_Skills__c';
    import EMS_Other_Experience__c from '@salesforce/schema/EMS_Resource_Request__c.EMS_Other_Experience__c';


    export default class ResourceRequestInputForm extends LightningElement {
     @track error;
     @track picklistValResType;
     @track picklistValExp;
     @track picklistValQual; 
     displayOtherJobRole = false;
     displayOtherNiceToHaveSkills = false;
     displayOtherExperience = false;

     handleSave() {  
         console.log('Res Data '+json.parse(this.resData));     
        saveResourceRequestRecord({resObj: this.resData})
        .then(result => {
            // Clear the user enter values
            this.resData = {};
            alert(result);
            window.console.log('result ===> '+result);
            // Show success messsage
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!!',
                message: 'Resource Request Created Successfully!!',
                variant: 'success'
            }),);
        })
        .catch(error => {
            this.error = error.message;
            console.log('error');
        });
    }

     @wire(pickListValueDynamically, {customObjInfo: {'sobjectType' : 'EMS_Resource_Request__c'},
     selectPicklistApi: 'EMS_Resource_Type__c'}) selectTargetValuesResourceType;
     selectOptionChanveValueResType(event){       
        // this.picklistValResType = event.target.value;
         this.resData.ResourceType = event.target.value;
         console.log('resource type data-->'+this.resData.ResourceType);
     }  
     @wire(pickListValueDynamically, {customObjInfo: {'sobjectType' : 'EMS_Resource_Request__c'},
     selectPicklistApi: 'EMS_Years__c'}) selectTargetValuesExperience;
     selectOptionChanveValueExp(event){       
         //this.picklistValExp = event.target.value;
         this.resData.RequiredExperience = event.target.value;
         if(event.target.value == 'Other'){
            this.displayOtherExperience = true;
         }else{
            this.displayOtherExperience = false;
         }
         console.log('RequiredExperience-->'+this.resData.RequiredExperience);
     }  
   
    @track resData = {     
        Department : EMS_Industry__c,
        DomainTechnology : EMS_Domain_Technology__c,  
        JobLocation : EMS_Job_Location__c,
        JobRole : EMS_Job_Role__c,
        KeySkills : EMS_Key_Skills__c,
        Manager : EMS_Manager__c,
        NicetoHaveSkills : EMS_Nice_to_Have_Skills__c,
        OtherNiceToHaveSkills : EMS_Other_Nice_To_Have_Skills__c,
        OtherJobRole : EMS_Other_Job_Role__c,
        ProjectId : EMS_Project_Id__c,
        Qualification : EMS_Required_Qualification__c,
        RequiredExperience : EMS_Years__c,
        OtherExperience : EMS_Other_Experience__c,
        RequirementTitle : EMS_Requirement_Title__c,
        ResourceType : EMS_Resource_Type__c,       
        VacantPositions : EMS_Vacant_Positions__c
    };
    //CompanyInformation : EMS_Company_Information__c,
    //JobDescription : EMS_Job_Description__c,
    //MustHaveSkills : EMS_Must_Have_Skills__c,
    //RolesandResponsibilities : EMS_Roles_and_Responsibilities__c,

    //Dependent picklist code start
    @track typeDependentPicklistWrapperArray;
    @track departmentOptions;   //type
    @track domainOptions;       //rating
    @track jobRoleOptions;      //industry
    selectedDepartmentValue;
    selectedDomainValue;
    selectedJobRoleValue;
    

    @wire(fetchDependentPicklistValues, {})
    wiredFetchDependentPicklistValues({ error, data }) {
        console.log('Data -->'+data);
        if (data) {
            try {
                this.typeDependentPicklistWrapperArray = JSON.parse(data);
                let options = [];
                for (var key in JSON.parse(data)) {
                    options.push({ label: key, value: key });
                }
                this.departmentOptions = options;
                this.domainOptions = undefined;
                this.jobRoleOptions = undefined;
            } catch (error) {
                console.error('check error here', error);
            }
        } else if (error) {
            console.error('check error here', error);
        }
    }

    handleDepartmentChange(event) {
        try {
            this.selectedDomainValue = undefined;
            this.selectedJobRoleValue = undefined;
            this.domainOptions = undefined;
            this.jobRoleOptions = undefined;
            let options = [];
            this.selectedDepartmentValue = event.detail.value;
            if (this.typeDependentPicklistWrapperArray) {
                for (var key in this.typeDependentPicklistWrapperArray) {
                    if (this.selectedDepartmentValue === key) {
                        for (var subkey in this.typeDependentPicklistWrapperArray[key]) {
                            for (var childkey in this.typeDependentPicklistWrapperArray[key][subkey]) {
                                options.push({ label: childkey, value: childkey });
                            }
                        }
                        break;
                    }
                }
                options = options.filter((thing, index) => {
                    const _thing = JSON.stringify(thing);
                    return index === options.findIndex(obj => {
                        return JSON.stringify(obj) === _thing;
                    });
                });
                this.domainOptions = options;
            }
            this.resData.Department = event.target.value;
         console.log('Department-->'+this.resData.Department);
        } catch (error) {
            console.error('check error here', error);
        }
    }

    handleDomainChange(event) {
        try {
            this.selectedJobRoleValue = undefined;
            this.jobRoleOptions = undefined;
            let options = [];
            this.selectedDomainValue = event.detail.value;
            if (this.typeDependentPicklistWrapperArray) {
                for (var key in this.typeDependentPicklistWrapperArray) {
                    if (this.selectedDepartmentValue === key) {
                        for (var subkey in this.typeDependentPicklistWrapperArray[key]) {
                            for (var childkey in this.typeDependentPicklistWrapperArray[key][subkey]) {
                                if (this.selectedDomainValue === childkey) {
                                    for (var grandchildkey in this.typeDependentPicklistWrapperArray[key][subkey][childkey]) {
                                        options.push({ label: this.typeDependentPicklistWrapperArray[key][subkey][childkey][grandchildkey], value: this.typeDependentPicklistWrapperArray[key][subkey][childkey][grandchildkey] });
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
                options = options.filter((thing, index) => {
                    const _thing = JSON.stringify(thing);
                    return index === options.findIndex(obj => {
                        return JSON.stringify(obj) === _thing;
                    });
                });
                this.jobRoleOptions = options;
            }
            this.resData.DomainTechnology = event.target.value;
         console.log('DomainTechnology-->'+this.resData.DomainTechnology);
        } catch (error) {
            console.error('check error here', error);
        }
    }
    handleJobRoleChange(event) {
        //this.selectedJobRoleValue = event.detail.value;
        this.resData.JobRole = event.target.value;
        console.log('JobRole-->'+this.resData.JobRole);
        if(event.target.value=='Other'){
            this.displayOtherJobRole = true;
            //this.resData.Other = event.target.value;
            console.log('Other-->'+this.resData.Other);
        }else{
            this.displayOtherJobRole = false;
        }
    }
    
    lstSelectedNiceToHaveSkills = [];
    @track niceToHaveSkillslstOptions = [];
    @wire (getObjectInfo, {objectApiName: EMS_Resource_Request__c})
    resourceObjectInfo;
    @wire(getPicklistValues, {recordTypeId: '$resourceObjectInfo.data.defaultRecordTypeId', fieldApiName: EMS_Nice_to_Have_Skills__c })
    niceToHaveSkillsPicklist(data, error){
        if(data && data.data && data.data.values){
            data.data.values.forEach( objPicklist => {
                this.niceToHaveSkillslstOptions.push({
                    label: objPicklist.label,
                    value: objPicklist.value
                });
            });
        } else if(error){
            console.log(error);
        }
        
    };
    handleChangeNiceToHaveSkills(event) {
        this.lstSelectedNiceToHaveSkills = event.detail.value;
        this.resData.NicetoHaveSkills = event.target.value;
        console.log('NicetoHaveSkills-->'+this.resData.NicetoHaveSkills);
        if(event.target.value=='Other'){
            this.displayOtherNiceToHaveSkills = true;
            //this.resData.Other = event.target.value;
            console.log('Other-->'+this.resData.Other);
        }else{
            this.displayOtherNiceToHaveSkills = false;
        }
    }

    lstSelectedKeySkills = [];
    @track keySkillslstOptions = [];
    @wire (getObjectInfo, {objectApiName: EMS_Resource_Request__c})
    resourceObjectInfo;
    @wire(getPicklistValues, {recordTypeId: '$resourceObjectInfo.data.defaultRecordTypeId', fieldApiName: EMS_Key_Skills__c })
    keySkillsPicklist(data, error){
        if(data && data.data && data.data.values){
            data.data.values.forEach( objPicklist => {
                this.keySkillslstOptions.push({
                    label: objPicklist.label,
                    value: objPicklist.value
                });
            });
        } else if(error){
            console.log(error);
        }
    };
    handleChangeKeySkills(event) {
        //this.lstSelectedKeySkills = event.detail.value;
        this.resData.KeySkills = event.target.value;
        console.log('KeySkills-->'+this.resData.KeySkills);
    }

    
    lstSelectedQualification = [];
    @track qualificationOptions = [];
    @wire (getObjectInfo, {objectApiName: EMS_Resource_Request__c})
    resourceObjectInfo;
    @wire(getPicklistValues, {recordTypeId: '$resourceObjectInfo.data.defaultRecordTypeId', fieldApiName: EMS_Required_Qualification__c })
    qualificationPicklist(data, error){
        if(data && data.data && data.data.values){
            data.data.values.forEach( objPicklist => {
                this.qualificationOptions.push({
                    label: objPicklist.label,
                    value: objPicklist.value
                });
            });
        } else if(error){
            console.log(error);
        }
    };
    handleChangeQualification(event) {
        //this.lstSelectedQualification = event.detail.value;
        this.resData.Qualification = event.target.value;
        console.log('Qualification-->'+this.resData.Qualification);
    }

    lstSelectedJobLocation = [];
    @track jobLocationOptions = [];
    @wire (getObjectInfo, {objectApiName: EMS_Resource_Request__c})
    resourceObjectInfo;
    @wire(getPicklistValues, {recordTypeId: '$resourceObjectInfo.data.defaultRecordTypeId', fieldApiName: EMS_Job_Location__c })
    jobLocationPicklist(data, error){
        if(data && data.data && data.data.values){
            data.data.values.forEach( objPicklist => {
                this.jobLocationOptions.push({
                    label: objPicklist.label,
                    value: objPicklist.value
                });
                
            });
        } else if(error){
            console.log(error);
        }
    };
    handleChangeJobLocation(event) {
        //this.lstSelectedJobLocation = event.detail.value;
        this.resData.JobLocation = event.target.value;
        console.log('JobLocation-->'+this.resData.JobLocation);
    }

    handleRequirnemtChange(event){
        this.resData.RequirementTitle = event.target.value;
        console.log('RequirementTitle-->'+this.resData.RequirementTitle);
    }

    handleVacantPosition(event){
        this.resData.VacantPositions = event.target.value;
        console.log('VacantPositions-->'+this.resData.VacantPositions);
    }

    handleProjectSelection(event){
        this.resData.ProjectId = event.target.value;
        console.log("the selected ProjectId id is"+event.detail);

    }

    handleManagerSelection(event){
        console.log("the selected Manager id is"+event.detail);
        this.resData.Manager = event.target.value;
    }

    handleOtherJobRole(event){
        this.resData.OtherJobRole = event.target.value;
        console.log("the selected Other "+this.resData.OtherJobRole);
    }

    handleOtherNiceToHaveSkills(event){
        this.resData.OtherNiceToHaveSkills = event.target.value;
        onsole.log("the selected OtherNiceToHaveSkills "+this.resData.OtherJobRole);
    }

    handleOtherExperience(event){
        this.resData.OtherExperience = event.target.value;
        onsole.log("the selected OtherExperience "+this.resData.OtherJobRole);
    }

    
}