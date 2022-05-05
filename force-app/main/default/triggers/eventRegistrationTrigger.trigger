trigger eventRegistrationTrigger on Event_Registration__c (before insert,before update) {
    if(Trigger.isBefore && (Trigger.isInsert || Trigger.isUpdate)){
        Set<Id> contactId = new Set<Id>();
        Set<Id> eventId = new Set<Id>();
        for(Event_Registration__c er : trigger.new){
            if(er.Attendee_Email__c == null && er.Contact__c!=null){
                contactId.add(er.Contact__c);
                eventId.add(er.Event__c);
            }
        }
        Map<Id,Contact> contactMap = new Map<Id,Contact>([select id,Email,Name,FirstName,LastName from Contact where Id IN: contactId]);
        Map<Id,Event__c> eventMap = new Map<Id,Event__c>([select id,Venue__c,Venue__r.Location_Information__c,Name from Event__c where Id IN: eventId]);
        for(Event_Registration__c er : trigger.new){
            if( er.Contact__c!=null && contactMap.containsKey(er.Contact__c)){
                er.Attendee_Email__c = contactMap.get(er.Contact__c).Email;
                String FirstName = contactMap.get(er.Contact__c).FirstName; 
                String LastName = contactMap.get(er.Contact__c).LastName; 
                FirstName = FirstName.substring(0,1).toUpperCase() + FirstName.substring(1).toLowerCase(); 
                LastName = LastName.substring(0,1).toUpperCase() + LastName.substring(1).toLowerCase();
                er.Name_on_Badge__c = FirstName + ' ' + LastName;
                if(eventMap.containsKey(er.Event__c)){
                    if(eventMap.get(er.Event__c).Venue__c != null && eventMap.get(er.Event__c).Venue__r.Location_Information__c != null){
                        er.Location_Information__c = eventMap.get(er.Event__c).Venue__r.Location_Information__c;
                    }
                }
            }
        }
    }
}