trigger EMSJobDescriptionTrigger on EMS_Job_Description__c (before insert,before delete) {
     if(trigger.isInsert){
        if(trigger.isBefore){
            JobDescriptionTriggerHandler.preventDuplicateRecod(trigger.new);
        }
    }
    
    if(trigger.isDelete){
        if(trigger.isBefore){
            JobDescriptionTriggerHandler.preventDeleteRecod(trigger.new);
        }
    }
}