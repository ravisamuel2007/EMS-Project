import { LightningElement, track, wire, api } from 'lwc';
import getContactsRelatedToAccount from 
'@salesforce/apex/relatedlistController.getjobOpeningsRelatedToRR';
export default class jobOpeningrelatedlist extends LightningElement {
    @api recordId;
    @track JobOpenings;
    @track title = 'Job Openings';
    @track columns = [
        {
            label: 'Job Opening Id',
            fieldName: 'nameUrl',
            type: 'url',
            typeAttributes: {
                label: {
                    fieldName: 'Name'
                },
                target: '_blank'
            }
        },
        //{ label: ' Job Opening Id', fieldName: 'Name', type: 'Auto Number' },
        { label: ' Posting Title', fieldName: 'EMS_Posting_Title__c', type: 'Text Area' },
        { label: 'Working Experience', fieldName: 'EMS_Vacant_Positions__c',type:'Number'},
        { label: 'Job Role', fieldName: 'EMS_Job_Role__c', type:'Picklist'},
        { label: 'Department Name', fieldName: 'EMS_Industry__c', type:'Picklist'},
        { label: 'Domain', fieldName: 'EMS_Domain_Technology__c', type:'Picklist'}
    ];

    @wire(getContactsRelatedToAccount, {recId: '$recordId'}) 
    WireContactRecords({error, data}){
        if(data){
            console.log(JSON.stringify(data));
            if (data.length != null && data.length >0) {
                this.title += ' (' + data.length + ')';
            }
            this.JobOpenings = data;
            this.error = undefined;
            
            let nameUrl;
                    this.JobOpenings = data.map(row => {
                        nameUrl = `/${row.Id}`;
                        return { ...row, nameUrl }
                    })
        }else{
            this.error = error;
            this.JobOpenings = undefined;
        }
    }
}