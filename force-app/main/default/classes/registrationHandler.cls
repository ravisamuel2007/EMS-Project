public without sharing class registrationHandler {
    public registrationHandler() {
        
    }
    @AuraEnabled
    public static string createEventParticipant(EventParticipant data){
        try {
            Contact c = getContact(data.email);
            if(c == null){
                c = new Contact();
                c.Email = data.email;
                c.AccountId = '0015e00000Rwa8ZAAR';
                c.FirstName = data.firstName;
                c.LastName = data.lastName;
                c.linkedInURL__c = data.linkedInUrl;
                c.Company__c = data.companyName;
                c.Phone = data.phoneNumber;
                insert c; 
            }
            Event__c event = getEventId();
            Event_Registration__c reg = getEventRegistation(event.Id,c.Id);
            if(reg==null){
                reg = new Event_Registration__c();
                reg.Event__c = event.Id;
            }
                reg.Contact__c = c.Id;
                reg.Attendee_Status__c = 'Registered';
                reg.Attendee_Email__c = data.email;
                String FirstName = data.firstName; 
                String LastName = data.lastName; 
                FirstName = FirstName.substring(0,1).toUpperCase() + FirstName.substring(1).toLowerCase(); 
                LastName = LastName.substring(0,1).toUpperCase() + LastName.substring(1).toLowerCase();
                reg.Name_on_Badge__c = FirstName + ' ' + LastName;
                if(event.Venue__c!=null){
                reg.Location_Information__c = event.Venue__r.Location_Information__c;
                }   
            upsert reg;
            sendEmail(reg,c);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return null;
    }
    public static Event__c getEventId(){
        return [select id,Venue__c,Venue__r.Location_Information__c from Event__c where currentEvent__c=true][0];
    }
    public static void sendEmail(Event_Registration__c reg,Contact con){
        //Event_Registration__c reg = [select id,event_Name__c,Name_on_Badge__c,Location_Information__c from Event_Registration__c where id=:r.Id];
        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
        message.setTargetObjectId(con.id); 
        message.setSenderDisplayName('CloudPeritus Admin'); 
        message.setReplyTo('no-reply@CloudPeritus.com');
        message.setUseSignature(false); 
        message.setBccSender(false); 
        message.setSaveAsActivity(false); 
        EmailTemplate emailTemplate = [Select Id,Subject,Description,HtmlValue,DeveloperName,Body from EmailTemplate where name = 'Email_Confirmation'];
        message.setTemplateID(emailTemplate.Id); 
        message.setWhatId(reg.Id); //This is important for the merge fields in template to work
        //message.toAddresses = new String[] { con.email};
            Messaging.SingleEmailMessage[] messages = new List<Messaging.SingleEmailMessage> {message};
                Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
        
        if (results[0].success) 
        {
            System.debug('Email sent successfully');
        } else {
            System.debug('Email failed' +  results[0].errors[0].message);
        }
    
}
public static Event_Registration__c getEventRegistation(Id eventId , Id contactId){
    List<Event_Registration__c> reg = [select id,Event__c,Contact__c,Attendee_Status__c,Attendee_Email__c,Name_on_Badge__c,Location_Information__c from Event_Registration__c where Event__c=:eventId and Contact__c=:contactId];
    if(reg.size()>0){
        return reg[0];
    }else{
        return null;
    }
}
public static Contact getContact(string userEmail){
    List<Contact> con = [select id,FirstName,LastName,Email,AccountId,linkedInURL__c,Company__c,Phone from Contact where Email=:userEmail];
    if(con.size()>0){
        return con[0];
    }else{
        return null;
    }
}
public class EventParticipant{
    @AuraEnabled public String firstName {get;set;}
    @AuraEnabled public String lastName {get;set;}
    @AuraEnabled public String email {get;set;}
    @AuraEnabled public String companyName {get;set;}
    @AuraEnabled public String linkedInUrl {get;set;}
    @AuraEnabled public String phoneNumber {get;set;}
}
}