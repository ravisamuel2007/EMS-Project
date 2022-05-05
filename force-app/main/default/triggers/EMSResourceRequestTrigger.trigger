trigger EMSResourceRequestTrigger on EMS_Resource_Request__c (after update,before insert,before update,before delete) {
    if(trigger.isUpdate){
        if(trigger.isAfter){
            ResourceRequestTriggerHandler.createJobOpening(trigger.new);
            
        }
    }
    
    if(trigger.isInsert){
        if(trigger.isBefore){
            ResourceRequestTriggerHandler.updateJobDescriptionBeforeInsert(trigger.new);
        }
    }
    if(trigger.isUpdate){
        if(trigger.isBefore){
            ResourceRequestTriggerHandler.restrictSubmitForApproval(trigger.new,trigger.oldMap);
            ResourceRequestTriggerHandler.updateJobDescriptionBeforeUpdate(trigger.new);
        }
    }

    if(trigger.isDelete){
        if(trigger.isBefore){
            ResourceRequestTriggerHandler.restrictDelete(trigger.new);
        }
    }
    
}