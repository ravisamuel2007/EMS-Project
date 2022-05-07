public class ResReqLds {
    @AuraEnabled(cacheable=true)
    public static List<EMS_Job_Description__c> getJobDescription(String department,String domain, String jobRole){
        return [Select id, EMS_Industry__c,EMS_Domain_Technology__c,EMS_Job_Description__c,EMS_Job_Role__c,EMS_Roles_and_Responsibilities__c 
        From EMS_Job_Description__c Where EMS_Industry__c =: department and EMS_Domain_Technology__c =: domain and EMS_Job_Role__c=: jobRole];


    }
}