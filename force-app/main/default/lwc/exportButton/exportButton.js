import { LightningElement, track} from 'lwc';
// importing accounts
//import getApplicantList from '@salesforce/apex/exportButtonController.getApplicants';
import datafiltration from '@salesforce/apex/exportButtonController.filterdata';

// imported to show toast messages
import {ShowToastEvent} from 'lightning/platformShowToastEvent';


// datatable columns
const cols = [
    {label: 'Name',fieldName: 'Name'}, //y
    {label: 'User Email',fieldName: 'CheckUserMail__c'},//y
   // {label: 'Current Work location',fieldName: 'EMS_Working_location__c'}, 
    {label: 'Education',fieldName: 'EMS_Education__c'}, //y
    {label: 'Total Experience',fieldName: 'EMS_Experience__c'}, //y
   // {label: 'Job Role',fieldName: 'EMS_Job_Role__c'},
    {label: 'First Name',fieldName: 'EMS_First_Name__c'},//y
    {label: 'Last Name',fieldName: 'EMS_Last_Name__c'},//y
    {label: 'Candidate Id',fieldName: 'EMS_Applicant_Id__c'},//y
    {label: 'Email',fieldName: 'Email__c'},//y
   // {label: 'Technology working on / worked upon',fieldName: 'EMS_Technology__c'},
    {label: 'Skills',fieldName: 'EMS_Skills__c'},//y
    {label: 'Previous Company Name',fieldName: 'EMS_Previous_Company_Name__c'},//y
   // {label: 'Employment type',fieldName: 'EMS_Employment_type__c'},
    {label: 'Phone Number',fieldName: 'EMS_Phone_Number__c'},//y
    //{label: 'Feedback',fieldName: 'EMS_Feedback__c'},
    //{label: 'Job description',fieldName: 'EMS_Job_description__c'},
   // {label: 'Job Opening',fieldName: 'EMS_Job_Opening__c'},
    {label: 'University',fieldName: 'EMS_University__c'},//y
    {label: 'Preferred Location',fieldName: 'EMS_Preferred_Location__c'},//y
    {label: 'College',fieldName: 'EMS_College__c'},//y
    {label: 'Experience(Years)',fieldName: 'Experience_Years__c'},//y
    {label: 'Experience(Months)',fieldName: 'Experience_Months__c'},//y
];

export default class exportButton extends LightningElement {
    @track error;
    @track data;
    @track columns = cols;
    datecreation;
    todatecreation;


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
      console.log("fromdate"+this.datecreation);
      console.log("todate" +this.todatecreation);
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
        //return;
    } 


    if (!this.datecreation && !this.todatecreation) {
      //this.error = 'Please Enter From Date..';
      this.dispatchEvent(
          new ShowToastEvent({
              title: 'Please Enter From and To Date to get the Filtered Data..', 
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
    datafiltration({fromdate:this.datecreation,todate:this.todatecreation})
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
          }else {
            this.data = result;
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
      return new Date(datecreation).getTime() <= new Date(todatecreation).getTime()
  }
 /* validateDate1(datecreation, todatecreation){
    return new Date(datecreation).getTime() == new Date(todatecreation).getTime()+24;
}*/


    // fetching records from server and reset
    getallapplicants() {
        datafiltration({fromdate:null,todate:null})
        
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
        //var date1 = 5;
       // let nameDate = JSON.stringify(date1);
       let currentdate = new Date();
      var filename = 'Applicant Data-' + currentdate.getDate() + '-'+(currentdate.getMonth()+1) 
    + '-' + currentdate.getFullYear() + '.csv'; 
    console.log(filename);
        downloadElement.download = filename;
       // downloadElement.download = 'Applicant Data.csv';
        // below statement is required if you are using firefox browser
        document.body.appendChild(downloadElement);
        // click() Javascript function to download CSV file
        downloadElement.click(); 
    }
    columnHeader=['Id','Name','Candidate Email','Education','Total Experience','First Name','User Email',
    'Last Name','Candidate Id','Email','Skills','Previous Company Name','Phone Number','University','Preferred Location',
  'College','Experience(Years)','Experience(Months)']
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
if(record.EMS_Email__c !==null && record.EMS_Email__c !==undefined && record.EMS_Email__c !=='undefined'){
  doc += '<td>'+record.EMS_Email__c+'</td>';
}else{
  doc += '<td> </td>';
}
if(record.EMS_Education__c !==null && record.EMS_Education__c !==undefined && record.EMS_Education__c !=='undefined'){
  doc += '<td>'+record.EMS_Education__c+'</td>';
}else{
  doc += '<td> </td>';
}
if(record.EMS_Experience__c !==null && record.EMS_Experience__c !==undefined && record.EMS_Experience__c !=='undefined'){
  doc += '<td>'+record.EMS_Experience__c+'</td>';
}else{
  doc += '<td> </td>';
}
if(record.EMS_First_Name__c !==null && record.EMS_First_Name__c !==undefined && record.EMS_First_Name__c !=='undefined'){
  doc += '<td>'+record.EMS_First_Name__c+'</td>';
}else{
  doc += '<td> </td>';
}
if(record.EMS_Last_Name__c !==null && record.EMS_Last_Name__c !==undefined && record.EMS_Last_Name__c !=='undefined'){
  doc += '<td>'+record.EMS_Last_Name__c+'</td>';
}else{
  doc += '<td> </td>';
}

if(record.EMS_Candidate_Id__c !==null && record.EMS_Candidate_Id__c !==undefined && record.EMS_Candidate_Id__c !=='undefined'){
  doc += '<td>'+record.EMS_Candidate_Id__c+'</td>';
}else{
  doc += '<td> </td>';
}
if(record.Email__c !==null && record.Email__c !==undefined && record.Email__c !=='undefined'){
  doc += '<td>'+record.Email__c+'</td>';
}else{
  doc += '<td> </td>';
}
if(record.EMS_Skills__c !==null && record.EMS_Skills__c !==undefined && record.EMS_Skills__c !=='undefined'){
  doc += '<td>'+record.EMS_Skills__c+'</td>';
}else{
  doc += '<td> </td>';
}
if(record.EMS_Previous_Company_Name__c !==null && record.EMS_Previous_Company_Name__c !==undefined && record.EMS_Previous_Company_Name__c !=='undefined'){
  doc += '<td>'+record.EMS_Previous_Company_Name__c+'</td>';
}else{
  doc += '<td> </td>';
}
if(record.EMS_Phone_Number__c !==null && record.EMS_Phone_Number__c !==undefined && record.EMS_Phone_Number__c !=='undefined'){
  doc += '<td>'+record.EMS_Phone_Number__c+'</td>';
}else{
  doc += '<td> </td>';
}
if(record.EMS_University__c !==null && record.EMS_University__c !==undefined && record.EMS_University__c !=='undefined'){
    doc += '<td>'+record.EMS_University__c+'</td>';
}else{
    doc += '<td> </td>';
  }
  if(record.EMS_Preferred_Location__c !==null && record.EMS_Preferred_Location__c !==undefined && record.EMS_Preferred_Location__c !=='undefined'){
    doc += '<td>'+record.EMS_Preferred_Location__c+'</td>';
}else{
    doc += '<td> </td>';
  }
  if(record.CheckUserMail__c !==null && record.CheckUserMail__c !==undefined && record.CheckUserMail__c !=='undefined'){
    doc += '<td>'+record.CheckUserMail__c+'</td>';
}else{
    doc += '<td> </td>';
  }
  if(record.EMS_College__c !==null && record.EMS_College__c !==undefined && record.EMS_College__c !=='undefined'){
    doc += '<td>'+record.EMS_College__c+'</td>';
}else{
    doc += '<td> </td>';
  }
  if(record.Experience_Years__c !==null && record.Experience_Years__c !==undefined && record.Experience_Years__c !=='undefined'){
    doc += '<td>'+record.Experience_Years__c+'</td>';
}else{
    doc += '<td> </td>';
  }
  if(record.Experience_Months__c !==null && record.Experience_Months__c !==undefined && record.Experience_Months__c !=='undefined'){
    doc += '<td>'+record.Experience_Months__c+'</td>';
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
      var filename = 'Applicant Data-' + currentdate.getDate() + '-'+(currentdate.getMonth()+1) 
    + '-' + currentdate.getFullYear() + '.xls'; 
    console.log(filename);
        downloadElement.download = filename;
//downloadElement.download = 'Applicant Data.xls';
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