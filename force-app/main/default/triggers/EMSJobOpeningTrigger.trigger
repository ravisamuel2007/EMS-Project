trigger EMSJobOpeningTrigger on EMS_Job_Opening__c (before delete) {
if(trigger.isDelete){
        if(trigger.isBefore){
            EMSJobOpeningTriggerHandler.restrictDelete(trigger.new);
        }
    }
}