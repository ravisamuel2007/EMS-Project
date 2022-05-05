import { LightningElement ,api} from 'lwc';
import isPresent from "@salesforce/apex/markAsPresentController.isPresent";
import updateRecordToPresent from "@salesforce/apex/markAsPresentController.updateRecordToPresent";

export default class MarkAsPresent extends LightningElement {
    @api recordId;
    isPresent=false;
    connectedCallback(){
        isPresent({recordId:this.recordId}).then((result)=>{
            this.isPresent = result;
        }).catch((error)=>{console.log(error)});
    }
    handleClick(){
        updateRecordToPresent({recordId:this.recordId}).then((result)=>{
            this.isPresent = result;
        }).catch((error)=>{console.log(error)});
    }
}