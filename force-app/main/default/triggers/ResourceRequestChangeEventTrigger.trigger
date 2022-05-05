trigger ResourceRequestChangeEventTrigger on EMS_Resource_Request__ChangeEvent (after insert) {
    if(trigger.isUpdate){
        if(trigger.isAfter){
            
        }
    }

}