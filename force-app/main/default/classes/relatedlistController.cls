public with sharing class relatedlistController {
    @AuraEnabled(cacheable=true)
    public static List<EMS_Job_Opening__c> getjobOpeningsRelatedToRR(String recId) {
        system.debug('recId >> ' + recId);
        try {
        string externalkey =[SELECT EMS_Foreign_Key__c from EMS_Resource_Request__c WHERE Id =:recId].EMS_Foreign_Key__c;
        
        
        return [SELECT Id,Name, EMS_Posting_Title__c, EMS_Industry__c,EMS_Domain_Technology__c,EMS_Job_Role__c, EMS_Project_Name__c,EMS_Vacant_Positions__c,Foreign_Key__c from EMS_Job_Opening__c where Foreign_Key__c = :externalkey];
        } catch(Exception ex) {
            throw new AuraHandledException('Not able to prodess : ' + ex.getMessage());
        }
        
    }
}