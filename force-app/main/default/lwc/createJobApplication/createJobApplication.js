import { LightningElement ,api} from 'lwc';
import DoesApplicationExist from "@salesforce/apex/CreateJobAppController.DoesApplicationExist";
import createRecord from "@salesforce/apex/CreateJobAppController.createRecord";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateJobApplication extends LightningElement {
    @api recordId;
    isPresent=false;
    connectedCallback(){
        DoesApplicationExist({recordId:this.recordId}).then((result)=>{
            this.isPresent = result;
        }).catch((error)=>{console.log(error)});
    }
    handleClick(){
        createRecord({recordId:this.recordId}).then((result)=>{
            this.isPresent = result;
            this.showNotification();
        }).catch((error)=>{console.log(error)});
    }
    showNotification() {
        const evt = new ShowToastEvent({
            title: 'Success',
            message: 'You have applied to this job succesfully',
            variant: Success,
        });
        this.dispatchEvent(evt);
    }
}