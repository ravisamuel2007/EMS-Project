global class FeedbackBatch implements Database.Batchable<sObject> {
    global Database.QueryLocator start(Database.BatchableContext BC) {
        String Attend = 'Attended';
        String query = 'SELECT Id,Contact__c,Attendee_Email__c FROM Event_Registration__c WHERE Event__r.currentEvent__c=true AND Attendee_Status__c = \''+String.escapeSingleQuotes(Attend)+'\'';
        system.debug('query string ' + query);
        return Database.getQueryLocator(query);
    }
    global String body='';
    global List<Event_Registration__c> EventList = new List<Event_Registration__c>();
    global void execute(Database.BatchableContext BC, List<Event_Registration__c> scope) {
        for(Event_Registration__c a : scope)
        {
            EventList.add(a);
        }
        
     List<Messaging.SingleEmailMessage> lstEmail = new List<Messaging.SingleEmailMessage>();    
        for(Event_Registration__c  a:EventList){
            String[] toadd=new String[]{a.Attendee_Email__c};
           
            Messaging.SingleEmailMessage mail1=new Messaging.SingleEmailMessage();
  
            //mail1.setToAddresses(toadd); no need as we are using contact.
            mail1.setTargetObjectId(a.Contact__c); 
            mail1.setSenderDisplayName('CloudPeritus Admin'); 
            mail1.setReplyTo('no-reply@CloudPeritus.com');
            mail1.setUseSignature(false); 
            mail1.setBccSender(false); 
            mail1.setSaveAsActivity(false); 
            EmailTemplate emailTemplate = [Select Id,Subject,Description,HtmlValue,DeveloperName,Body from EmailTemplate where name = 'FeedbackMailTemplate'];
            mail1.setTemplateID(emailTemplate.Id); 
            mail1.setWhatId(a.Id);
            lstEmail.add(mail1);
        }
        System.debug(lstEmail.size());
        Messaging.SendEmail(lstEmail);
    }  
    
    global void finish(Database.BatchableContext BC) {
        
    }
}