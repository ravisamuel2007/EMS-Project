import { LightningElement, track, api} from 'lwc';
// importing records
import datafiltration from '@salesforce/apex/JobApplicantsController.filterdata';
//import { CloseActionScreenEvent } from 'lightning/actions';

// imported to show toast messages
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import Job_Applications_Export_To_Excel_Columns from '@salesforce/label/c.Job_Applications_Export_To_Excel_Columns';


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
        if(this.validateDate(this.datecreation, this.todatecreation)){
            console.log("Data is Valid");
        } else if(this.datecreation != null && this.datecreation != '' && this.todatecreation != null && this.todatecreation != ''){
           // this.error = "End Date cannot be greater than Start Date";
            this.data = undefined;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'End Date cannot be greater than Start Date', 
                    //message: this.error, 
                    variant: 'error'                  
                }),
            );
        } 

        if (!this.datecreation && !this.todatecreation) {
            //this.error = 'Please Enter From Date..';
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Please Enter From and To Date and Status to get the Filtered Data..', 
                    //message: this.error, 
                    variant: 'error'                  
                }),
            );
            this.data = undefined;
            return;
        }
        else if (!this.datecreation) {
            //this.error = 'Please Enter From Date..';
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Please Enter From Date..', 
                    //message: this.error, 
                    variant: 'error'                  
                }),
            );
            this.data = undefined;
            return;
        }
        else if (!this.todatecreation) {
            //this.error = 'Please Enter To Date..';
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Please Enter To Date..', 
                    //message: this.error, 
                    variant: 'error'                  
                }),
            );
            this.data = undefined;
            return;
        }else {
            this.error = '';
        }
      
      
      
      
      
      
      

        
    console.log('Im here' +this.datecreation+'--'+this.todatecreation);
    datafiltration({joId:this.recordId, fromdate:this.datecreation,todate:this.todatecreation })
        .then(result => {
            console.log(JSON.stringify(result));
            if (result.length == 0) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'No Records Available...', 
                        //message: this.error, 
                        variant: 'error'                  
                    }),
                );
                this.data = undefined;
            }else{
            this.data = result;
            this.data = this.data.map( row => {
                return { ...row, JobName: row.EMS_Job_Opening__r.EMS_Posting_Title__c,ApplicantName:row.EMS_Applicant__r.Name};
            });
            this.error = undefined;
        }
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
    validateDate(datecreation, todatecreation){
        return new Date(datecreation).getTime() < new Date(todatecreation).getTime()
    }
  
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
   /* closeQuickAction() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }*/

    // this method validates the data and creates the csv file to download
    downloadCSVFile() { 
        if(this.data===undefined || this.data.length<=0){

           // this.error = "End Date cannot be greater than Start Date";
            this.data = undefined;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Please select button "All"', 
                    //message: this.error, 
                    variant: 'error'   
                                   
                }),
                
            );
            return;
        }   
        let rowEnd = '\n';
        let csvString = '';
        // this set elminates the duplicates if have any duplicate keys
        //let rowData = Job_Applications_Export_To_Excel_Columns;

        // getting keys from data
       /* this.data.forEach(function (record) {
            Object.keys(this.data[0]).forEach(function (key) {
                if(!key.includes('__r')){
                    rowData.add(key);
                }
            });
        });*/

        // Array.from() method returns an Array object from any object with a length property or an iterable object.
        
        let rowData = Job_Applications_Export_To_Excel_Columns.split(',');
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
        let currentdate = new Date();
      var filename = 'Job Applications-' + currentdate.getDate() + '-'+(currentdate.getMonth()+1) 
    + '-' + currentdate.getFullYear() + '.csv'; 
    console.log(filename);
        downloadElement.download = filename;
        //downloadElement.download = 'Job Applications.csv';
        // below statement is required if you are using firefox browser
        document.body.appendChild(downloadElement);
        // click() Javascript function to download CSV file
        downloadElement.click(); 
    }
    columnHeader=['Id','Applicant','Job Application ID','Job Name']
    //change here for xls
    exportContactData(){
        if(this.data===undefined || this.data.length<=0){

            // this.error = "End Date cannot be greater than Start Date";
             this.data = undefined;
             this.dispatchEvent(
                 new ShowToastEvent({
                     title: 'Please select button "All"', 
                     //message: this.error, 
                     variant: 'error'   
                                    
                 }),
                 
             );
             return;
         }   
        // Prepare a html table
        let doc = '<table>';
        
        
        // Add styles for the table
        doc += '<style>';
        doc += 'table, th, td {';
        doc += 'border: 1px solid black;';
        doc += 'border-collapse: collapse;';
        doc += '}';          
        doc += '</style>';
        // Add all the Table Headers
        doc += '<tr>';
        this.columnHeader.forEach(element => {            
            doc += '<th>'+ element +'</th>'           
        });
        doc += '</tr>';
        // Add the data rows
        this.data.forEach(record => {
            doc += '<tr>';
            doc += '<td>'+record.Id+'</td>'; 
            if(record.ApplicantName!==null && record.ApplicantName!==undefined && record.ApplicantName!=='undefined'){
                doc += '<td>'+record.ApplicantName +'</td>';
            }else{
                doc += '<td> </td>';
            }
            if(record.Name !==null && record.Name !==undefined && record.Name !=='undefined'){
                doc += '<td>'+record.Name+'</td>';
            }else{
                doc += '<td> </td>';
            }
            if(record.JobName!==null && record.JobName!==undefined && record.JobName!=='undefined'){
                doc += '<td>'+record.JobName+'</td>';
            }else{
                doc += '<td> </td>';
            }
            
            doc += '</tr>';
        });
        doc += '</table>';
        var element = 'data:application/vnd.ms-excel,' + encodeURIComponent(doc);
        let downloadElement = document.createElement('a');
        downloadElement.href = element;
        downloadElement.target = '_self';
        // use .csv as extension on below line if you want to export data as csv
        let currentdate = new Date();
      var filename = 'Job Applications-' + currentdate.getDate() + '-'+(currentdate.getMonth()+1) 
    + '-' + currentdate.getFullYear() + '.xls'; 
    console.log(filename);
        downloadElement.download = filename;
       // downloadElement.download = 'Job Applications.xls';
        document.body.appendChild(downloadElement);
        downloadElement.click();
    }
    
        //changing from here
        selectedItemValue;
        handleOnselect(event) {
            this.selectedItemValue = event.detail.value;
            if (this.selectedItemValue == 'CSV'){
                this.downloadCSVFile();
            }
            if (this.selectedItemValue == 'Xlsx'){
                this.exportContactData();
            }
    } 
}