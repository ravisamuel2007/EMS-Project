public class jOpeningExport {
    /*@AuraEnabled(Cacheable = true)
    public static List<EMS_Applicant__c> getApplicants(){
      return [SELECT Id, Name,EMS_First_Name__c,EMS_Last_Name__c,EMS_Candidate_Id__c,Email__c,EMS_Technology__c, EMS_Working_location__c,EMS_Employment_type__c,EMS_Feedback__c,
      EMS_Skills__c,EMS_Education__c,EMS_Job_Opening__c,EMS_Previous_Company_Name__c,EMS_Phone_Number__c,EMS_Preferred_Location__c,EMS_Job_description__c, Experience__c, EMS_Job_Role__c FROM EMS_Applicant__c ];
    }*/
    @AuraEnabled(Cacheable = true)
    public static List<EMS_Job_Opening__c> filterdata(String fromdate, String todate,string stat ){
      //List<EMS_Job_Opening__c> recjob = new List<EMS_Job_Opening__c>();
      if (fromdate == null && todate == null) {
         //recjob = 
         return[SELECT Id,Name, EMS_Posting_Title__c,EMS_Project_Name__c,EMS_Industry__c,EMS_Domain_Technology__c,EMS_Job_Role__c,EMS_Vacant_Positions__c, EMS_Resource_Type__c,EMS_CTC_Offered__c,EMS_Posted_Date__c,
        EMS_Target_Date__c,EMS_Status__c,EMS_Years__c,EMS_Months__c,EMS_Must_Have_Skills__c, EMS_Nice_to_Have_Skills__c,EMS_Project__c FROM EMS_Job_Opening__c ];
      }
      else{
    Date fdate = Date.valueOf(fromdate);
    Date tdate = Date.valueOf(todate);
    // recjob =
    return[SELECT Id,Name, EMS_Posting_Title__c,EMS_Project_Name__c,EMS_Industry__c,EMS_Domain_Technology__c,EMS_Job_Role__c,EMS_Vacant_Positions__c, EMS_Resource_Type__c,EMS_CTC_Offered__c,EMS_Posted_Date__c,
    EMS_Target_Date__c,EMS_Status__c,EMS_Years__c,EMS_Months__c,EMS_Must_Have_Skills__c, EMS_Nice_to_Have_Skills__c,EMS_Project__c FROM EMS_Job_Opening__c 
     where Day_Only(createddate) >=:fdate and Day_Only(createddate) <=:tdate and EMS_Status__c =:stat ];
      }
     // return recjob;
    }

  }