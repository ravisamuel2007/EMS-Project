public class ResReqLds {
    @AuraEnabled(cacheable=true)
    public static String getJobDescription(String department,String domain, String jobRole){
       // return [Select id, EMS_Industry__c,EMS_Domain_Technology__c,EMS_Job_Description__c,EMS_Job_Role__c,EMS_Roles_and_Responsibilities__c 
        return [Select EMS_Job_Description__c From EMS_Job_Description__c Where EMS_Industry__c =: department and EMS_Domain_Technology__c =: domain and EMS_Job_Role__c=: jobRole limit 1].EMS_Job_Description__c;


    }
}