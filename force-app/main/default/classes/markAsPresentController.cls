public with sharing class markAsPresentController {
    public markAsPresentController() {

    }
    @AuraEnabled
    public static Boolean isPresent(Id recordId){
        try {
            Event_Registration__c reg = [select id,Attendee_Status__c from Event_Registration__c where id=:recordId];
            if(reg.Attendee_Status__c == 'Attended'){
                return true;
            }else{
                return false;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static Boolean updateRecordToPresent(Id recordId){
        try {
            Event_Registration__c reg = [select id,Attendee_Status__c from Event_Registration__c where id=:recordId];
            reg.Attendee_Status__c = 'Attended';
            update reg;
            return true;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}