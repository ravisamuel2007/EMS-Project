public class exportButtonController {
  /*@AuraEnabled(Cacheable = true)
  public static List<EMS_Applicant__c> getApplicants(){
    return [SELECT Id, Name,EMS_First_Name__c,EMS_Last_Name__c,EMS_Candidate_Id__c,Email__c,EMS_Technology__c, EMS_Working_location__c,EMS_Employment_type__c,EMS_Feedback__c,
    EMS_Skills__c,EMS_Education__c,EMS_Job_Opening__c,EMS_Previous_Company_Name__c,EMS_Phone_Number__c,EMS_Preferred_Location__c,EMS_Job_description__c, Experience__c, EMS_Job_Role__c FROM EMS_Applicant__c ];
  }*/
  @AuraEnabled(Cacheable = true)
  public static List<EMS_Applicant__c> filterdata(String fromdate, String todate ){
    if (fromdate == null && todate == null) {
    return [SELECT Id, Name,EMS_First_Name__c,EMS_Last_Name__c,EMS_Applicant_Id__c,Email__c,EMS_Technology__c,EMS_University__c,
    EMS_Skills__c,EMS_Education__c,EMS_Previous_Company_Name__c,EMS_Phone_Number__c,EMS_Preferred_Location__c,EMS_Experience__c,CheckUserMail__c,EMS_College__c,Experience_Years__c,Experience_Months__c
     FROM EMS_Applicant__c];
    }
    else {
  Date fdate = Date.valueOf(fromdate);
  Date tdate = Date.valueOf(todate);
  system.debug('hello'+fdate);
  system.debug('hello'+tdate);
  return [SELECT Id,Name,EMS_First_Name__c,EMS_Last_Name__c,EMS_Applicant_Id__c,Email__c,EMS_Technology__c,EMS_University__c,
  EMS_Previous_Company_Name__c,EMS_Preferred_Location__c,EMS_Phone_Number__c,EMS_Skills__c,createddate, EMS_Education__c,EMS_Experience__c,CheckUserMail__c,
  EMS_College__c,Experience_Years__c,Experience_Months__c FROM EMS_Applicant__c 
   where Day_Only(createddate) >=:fdate and Day_Only(createddate) <=:tdate];
    }
  }
}