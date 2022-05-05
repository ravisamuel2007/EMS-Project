import { LightningElement, track, api} from 'lwc';
// importing records
import datafiltration from '@salesforce/apex/JobApplicantsController.filterdata';
import { CloseActionScreenEvent } from 'lightning/actions';

// imported to show toast messages
import {ShowToastEvent} from 'lightning/platformShowToastEvent';


// datatable columns
const cols = [
    {label: 'Applicant',fieldName: 'ApplicantName'},
    {label: 'Job Application ID',fieldName: 'Name'},
    { label: 'Job Name', fieldName: 'JobName' },
];


export default class exportButton extends LightningElement {
    @track error;
    @track data;
    @track columns = cols;
    datecreation;
    todatecreation;
    @api recordId


    dateFunction(event){
        this.datecreation = event.target.value;
    }
    todateFunction(event){
        this.todatecreation = event.target.value;
    }

    // this constructor invoke when component is created.
    // once component is created it will fetch the accounts
    
    @api invoke(){
        this.getallapplicants();
    }
    searchButton(){
    console.log('Im here' +this.datecreation+'--'+this.todatecreation);
    datafiltration({joId:this.recordId, fromdate:this.datecreation,todate:this.todatecreation })
        .then(result => {
            console.log(JSON.stringify(result));
            this.data = result;
            this.data = this.data.map( row => {
                return { ...row, JobName: row.EMS_Job_Opening__r.EMS_Posting_Title__c,ApplicantName:row.EMS_Applicant__r.Name};
            });
            this.error = undefined;
        })
        .catch(error => {
            this.error = error;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while getting Records', 
                    message: error.message, 
                    variant: 'error'
                }),
            );
            this.data = undefined;
        });
    }

    

    // fetching records from server and reset
    getallapplicants() {
        console.log(this.recordId);
        datafiltration({joId:this.recordId, fromdate:null,todate:null})
        .then(result => {
            this.data = result;
            this.data = this.data.map( row => {
                return { ...row, JobName: row.EMS_Job_Opening__r.EMS_Posting_Title__c,ApplicantName:row.EMS_Applicant__r.Name};
            });
            console.log(JSON.stringify(this.data));
            this.error = undefined;
            this.cleardata();
        })
        .catch(error => {
            this.error = error;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while getting Records', 
                    message: error.message, 
                    variant: 'error'
                }),
            );
            this.data = undefined;
        });
    }
    cleardata(){
        this.datecreation = '';
        this.todatecreation = '';
    }
    closeQuickAction() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }

    // this method validates the data and creates the csv file to download
    downloadCSVFile() {   
        let rowEnd = '\n';
        let csvString = '';
        // this set elminates the duplicates if have any duplicate keys
        let rowData = new Set();

        // getting keys from data
        this.data.forEach(function (record) {
            Object.keys(record).forEach(function (key) {
                if(!key.includes('__r')){
                    rowData.add(key);
                }
            });
        });

        // Array.from() method returns an Array object from any object with a length property or an iterable object.
        rowData = Array.from(rowData);
        
        // splitting using ','
        csvString += rowData.join(',');
        csvString += rowEnd;

        // main for loop to get the data based on key value
        for(let i=0; i < this.data.length; i++){
            let colValue = 0;

            // validating keys in data
            for(let key in rowData) {
                console.log(key+'__'+ key.includes('__r')); 
                if(rowData.hasOwnProperty(key) ) {
                    // Key value 
                    // Ex: Id, Name
                    let rowKey = rowData[key];
                    // add , after every value except the first.
                    if(!rowKey.includes('__r')){

                    
                    if(colValue > 0){
                        csvString += ',';
                    }
                    // If the column is undefined, it as blank in the CSV file.
                    let value = this.data[i][rowKey] === undefined ? '' : this.data[i][rowKey];
                    csvString += '"'+ value +'"';
                }
                    colValue++;
                }
            }
            csvString += rowEnd;
        }

        // Creating anchor element to download
        let downloadElement = document.createElement('a');

        // This  encodeURI encodes special characters, except: , / ? : @ & = + $ # (Use encodeURIComponent() to encode these characters).
        downloadElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvString);
        downloadElement.target = '_self';
        // CSV File Name
        downloadElement.download = 'Job Applicant Data.csv';
        // below statement is required if you are using firefox browser
        document.body.appendChild(downloadElement);
        // click() Javascript function to download CSV file
        downloadElement.click(); 
    }

}