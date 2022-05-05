public class EMS_RM_Controller{

        @AuraEnabled(cacheable=true)
         public static List<EMS_Resource_Request__c> getResourceRequest() {
         return [SELECT EMS_Job_Role__c, EMS_Resource_Type__c, EMS_Project_Id__c FROM EMS_Resource_Request__c];
         }
       
}