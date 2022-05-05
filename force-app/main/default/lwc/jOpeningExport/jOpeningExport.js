import { LightningElement,track} from 'lwc';
// importing accounts
//import getApplicantList from '@salesforce/apex/exportButtonController.getApplicants';
import datafiltration from '@salesforce/apex/jOpeningExport.filterdata';

// imported to show toast messages
import {ShowToastEvent} from 'lightning/platformShowToastEvent';


// datatable columns
const cols = [
    {label: 'Job Opening Id',fieldName: 'Name'},
    {label: 'Posting Title',fieldName: 'EMS_Posting_Title__c'},
    {label: 'Project Name',fieldName: 'EMS_Project_Name__c'}, 
    {label: 'Department Name',fieldName: 'EMS_Industry__c'}, 
    {label: 'Domain/Technology',fieldName: 'EMS_Domain_Technology__c'}, 
    {label: 'Job Role',fieldName: 'EMS_Job_Role__c'},
    {label: 'Vacant Positions',fieldName: 'EMS_Vacant_Positions__c'},
    {label: 'Resource Type',fieldName: 'EMS_Resource_Type__c'},
    {label: 'CTC Offered',fieldName: 'EMS_CTC_Offered__c'},
    {label: 'Posted Date',fieldName: 'EMS_Posted_Date__c'},
    {label: 'Target Date',fieldName: 'EMS_Target_Date__c'},
    {label: 'Status',fieldName: 'EMS_Status__c'},
    {label: 'Years',fieldName: 'EMS_Years__c'},
    {label: 'Months',fieldName: 'EMS_Months__c'},
    {label: 'Must Have Skills',fieldName: 'EMS_Must_Have_Skills__c'},
    {label: 'Nice to Have Skills',fieldName: 'EMS_Nice_to_Have_Skills__c'},
    
];

export default class jOpeningExport extends LightningElement {
    @track error;
    @track data;
    @track columns = cols;
    datecreation;
    todatecreation;
    selectedValue; 
    error;

    get options() {
        return [
            { label: 'Submitted', value: 'Submitted'},
            { label: 'Approved', value: 'Approved'},
            { label: 'Published', value: 'Published'},
            { label: 'In review', value: 'In review'},
            { label: 'Closed', value: 'Closed'},
            { label: 'Open', value: 'Open' }
        ];
    }
    handleChange(event){

this.selectedValue = event .target.value;
    }
    

    dateFunction(event){
        this.datecreation = event.target.value;
    }
    todateFunction(event){
        this.todatecreation = event.target.value;
    }

    // this constructor invoke when component is created.
    // once component is created it will fetch the accounts
    constructor() {
        super();
        this.getallapplicants();
    } 

    searchButton(){ 
        if(this.validateDate(this.datecreation, this.todatecreation)){
            console.log("Data is Valid");
        } else if(this.datecreation != null && this.datecreation != '' && this.todatecreation != null && this.todatecreation != ''&& this.selectedValue != null && this.selectedValue != ''){
           // this.error = "End Date cannot be greater than Start Date";
            this.data = undefined;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'From Date cannot be greater than To Date', 
                    //message: this.error, 
                    variant: 'error'                  
                }),
            );
        } 

        if (!this.datecreation && !this.todatecreation && !this.selectedValue) {
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
        }
        else if (!this.selectedValue) {
            //this.error = 'Please Enter Status..';
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Please Enter Status..', 
                    //message: this.error, 
                    variant: 'error'                  
                }),
            );
            this.data = undefined;
            return;
        }else {
            this.error = '';
        }













    console.log('Im here' +this.datecreation+'--'+this.todatecreation+ '--'+this.selectedValue);
    datafiltration({fromdate:this.datecreation,todate:this.todatecreation,stat:this.selectedValue})
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
            }
            else {
                this.data = result;
                this.error = undefined;
            }

            //this.data = result;
            //this.error = undefined;
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
        return new Date(datecreation).getTime() <= new Date(todatecreation).getTime()
    }
    


    // fetching records from server and reset
    getallapplicants() {
        datafiltration({fromdate:null,todate:null,stat:null})
        
        .then(result => {
            console.log(JSON.stringify(result));
            this.data = result;
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
        this.datecreation = null;
        this.todatecreation = null;
        this.selectedValue = null;
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
                rowData.add(key);
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
                if(rowData.hasOwnProperty(key)) {
                    // Key value 
                    // Ex: Id, Name
                    let rowKey = rowData[key];
                    // add , after every value except the first.
                    if(colValue > 0){
                        csvString += ',';
                    }
                    // If the column is undefined, it as blank in the CSV file.
                    let value = this.data[i][rowKey] === undefined ? '' : this.data[i][rowKey];
                    csvString += '"'+ value +'"';
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
      var filename = 'Job Openings-' + currentdate.getDate() + '-'+(currentdate.getMonth()+1) 
    + '-' + currentdate.getFullYear() + '.csv'; 
    console.log(filename);
        downloadElement.download = filename;
        // below statement is required if you are using firefox browser
        document.body.appendChild(downloadElement);
        // click() Javascript function to download CSV file
        downloadElement.click(); 
    }

columnHeader=['Id','Job Opening Id','Posting Title','Project Name','Department Name','Domain/Technology','Job Role','Resource Type',
              'CTC Offered','Posted Date','Target Date','Vacant Positions','Status','Years','Months','Must Have Skills','Nice to Have Skills']
//change here for xls
exportContactData(){
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
        if(record.Name !==null && record.Name !==undefined && record.Name !=='undefined'){
            doc += '<td>'+record.Name+'</td>';
        }else{
            doc += '<td> </td>';
        }
        if(record.EMS_Posting_Title__c !==null && record.EMS_Posting_Title__c !==undefined && record.EMS_Posting_Title__c !=='undefined'){
            doc += '<td>'+record.EMS_Posting_Title__c+'</td>';
        }else{
            doc += '<td> </td>';
        }
        if(record.EMS_Project_Name__c !==null && record.EMS_Project_Name__c !==undefined && record.EMS_Project_Name__c !=='undefined'){
            doc += '<td>'+record.EMS_Project_Name__c+'</td>';
        }else{
            doc += '<td> </td>';
        }
        if(record.EMS_Industry__c !==null && record.EMS_Industry__c !==undefined && record.EMS_Industry__c !=='undefined'){
            doc += '<td>'+record.EMS_Industry__c+'</td>';
        }else{
            doc += '<td> </td>';
        }
        if(record.EMS_Domain_Technology__c !==null && record.EMS_Domain_Technology__c !==undefined && record.EMS_Domain_Technology__c !=='undefined'){
            doc += '<td>'+record.EMS_Domain_Technology__c+'</td>';
        }else{
            doc += '<td> </td>';
        }
        if(record.EMS_Job_Role__c !==null && record.EMS_Job_Role__c !==undefined && record.EMS_Job_Role__c !=='undefined'){
            doc += '<td>'+record.EMS_Job_Role__c+'</td>';
        }else{
            doc += '<td> </td>';
        }
        if(record.EMS_Resource_Type__c !==null && record.EMS_Resource_Type__c !==undefined && record.EMS_Resource_Type__c !=='undefined'){
            doc += '<td>'+record.EMS_Resource_Type__c+'</td>';
        }else{
            doc += '<td> </td>';
        }
        if(record.EMS_CTC_Offered__c !==null && record.EMS_CTC_Offered__c !==undefined && record.EMS_CTC_Offered__c !=='undefined'){
            doc += '<td>'+record.EMS_CTC_Offered__c+'</td>';
        }else{
            doc += '<td> </td>';
        }
      
        if(record.EMS_Posted_Date__c !==null && record.EMS_Posted_Date__c !==undefined && record.EMS_Posted_Date__c !=='undefined'){
            doc += '<td>'+record.EMS_Posted_Date__c+'</td>';
        }else{
            doc += '<td> </td>';
        }
        if(record.EMS_Target_Date__c !==null && record.EMS_Target_Date__c !==undefined && record.EMS_Target_Date__c !=='undefined'){
            doc += '<td>'+record.EMS_Target_Date__c+'</td>';
        }else{
            doc += '<td> </td>';
        }
        if(record.EMS_Vacant_Positions__c !==null && record.EMS_Vacant_Positions__c !==undefined && record.EMS_Vacant_Positions__c !=='undefined'){
            doc += '<td>'+record.EMS_Vacant_Positions__c+'</td>';
        }else{
            doc += '<td> </td>';
        }
        if(record.EMS_Status__c !==null && record.EMS_Status__c !==undefined && record.EMS_Status__c !=='undefined'){
            doc += '<td>'+record.EMS_Status__c+'</td>';
        }else{
            doc += '<td> </td>';
        }
        if(record.EMS_Years__c !==null && record.EMS_Years__c !==undefined && record.EMS_Years__c !=='undefined'){
            doc += '<td>'+record.EMS_Years__c+'</td>';
        }else{
            doc += '<td> </td>';
        }
        if(record.EMS_Months__c !==null && record.EMS_Months__c !==undefined && record.EMS_Months__c !=='undefined'){
            doc += '<td>'+record.EMS_Months__c+'</td>';
        }else{
            doc += '<td> </td>';
        }
        if(record.EMS_Must_Have_Skills__c !==null && record.EMS_Must_Have_Skills__c !==undefined && record.EMS_Must_Have_Skills__c !=='undefined'){
            doc += '<td>'+record.EMS_Must_Have_Skills__c+'</td>';
        }else{
            doc += '<td> </td>';
        }
        if(record.EMS_Nice_to_Have_Skills__c !==null && record.EMS_Nice_to_Have_Skills__c !==undefined && record.EMS_Nice_to_Have_Skills__c !=='undefined'){
            doc += '<td>'+record.EMS_Nice_to_Have_Skills__c+'</td>';
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
      var filename = 'Job Openings-' + currentdate.getDate() + '-'+(currentdate.getMonth()+1) 
    + '-' + currentdate.getFullYear() + '.xls'; 
    console.log(filename);
        downloadElement.download = filename;
    //downloadElement.download = 'Job Openings.xls';
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