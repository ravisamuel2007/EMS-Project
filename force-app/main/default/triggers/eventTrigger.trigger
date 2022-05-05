trigger eventTrigger on Event__c (after update) {
    Set<Id> currentEvent = new Set<Id>();
    for(Event__c evt : trigger.new){
        if(trigger.oldMap.get(evt.Id).currentEvent__c==false && evt.currentEvent__c == true){
            currentEvent.add(evt.Id);
        }
    }
    system.debug(''+currentEvent);
    if(currentEvent.size()>0){
        List<Event__c> eventList = [select id,currentEvent__c from Event__c];
        for(Event__c eve: eventList){
            if(!currentEvent.contains(eve.Id)){
                eve.currentEvent__c = false;
            }
        }
        update eventList;
    }
}