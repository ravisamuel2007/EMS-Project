public class JobApplicantsController {
    @AuraEnabled(Cacheable = true)
  public static List<EMS_Job_Application__c> filterdata(String joId, String fromdate, String todate ){
    if (fromdate == null && todate == null) {
        return [Select Id, Name,EMS_Applicant__r.Name,EMS_Job_Opening__c,EMS_Job_Opening__r.EMS_Posting_Title__c FROM EMS_Job_Application__c where EMS_Job_Opening__c = :joId];
    }
    else {
  Date fdate = Date.valueOf(fromdate);
  Date tdate = Date.valueOf(todate);
  return [SELECT Id, Name,EMS_Applicant__r.Name,EMS_Job_Opening__c,EMS_Job_Opening__r.EMS_Posting_Title__c FROM EMS_Job_Application__c
   where Day_Only(createddate) >=:fdate and Day_Only(createddate) <=:tdate and EMS_Job_Opening__c = :joId];
    }
  }
}