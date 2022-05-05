import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import uploadFile from '@salesforce/apex/ResumeUpload.uploadFile'
export default class FileUploaderCompLwc extends LightningElement {
    @api recordId;
    fileData
    openfileUpload(event) {
        const file = event.target.files[0]
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
                'filename': file.name,
                'base64': base64,
                'recordId': this.recordId
            }
            console.log(this.fileData)
        }
        reader.readAsDataURL(file)
    }
    
    handleClick(){
        const {base64, filename, recordId} = this.fileData
        uploadFile({ base64, filename, recordId }).then(result=>{
            this.fileData = null
            console.log('result ' + result)
            if(result){
                let title = `${filename} uploaded successfully!!`
                this.toast(title)
            }
            else{
                let title = `You are not the owner of this record, hence can not upload the document`
                this.Errortoast(title)
            }
            
            
        })
    }

    toast(title){
        const toastEvent = new ShowToastEvent({
            title, 
            variant:"success"
        })
        this.dispatchEvent(toastEvent)
    }

    Errortoast(title){
        const toastEvent = new ShowToastEvent({
            title, 
            variant:"Warning"
        })
        this.dispatchEvent(toastEvent)
    }
}