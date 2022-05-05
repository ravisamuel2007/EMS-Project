public without sharing class FeedbackFormHandler {
    public FeedbackFormHandler() {}

    @AuraEnabled
    public static void createFeedback(Feedback data){
            
                Feedback__c fb = new Feedback__c();
        		fb.Name__c = data.Name;
                fb.Email__c = data.Email;
                fb.Phone__c = data.Phone;
                fb.Job_Role__c = data.Role;
                fb.Recommend__c = data.Recommend;
                fb.Event_Favorite_Part__c = data.Event_Favorite;
                fb.Experience__c = data.Experience;
                fb.Future_Prospect__c = data.Future_Prospect;
                fb.Goodies_Satisfaction__c = data.Goodies;
                fb.Remarks__c = data.remark;
                
                insert fb; 
            }
            
    

    public class Feedback{
        @AuraEnabled public String Name {get;set;}
        @AuraEnabled public String Email {get;set;}
        @AuraEnabled public String Phone {get;set;}
        @AuraEnabled public String Role {get;set;}
        @AuraEnabled public String Recommend {get;set;}
        @AuraEnabled public String Event_Favorite {get;set;}
        @AuraEnabled public String Experience {get;set;}
        @AuraEnabled public String Future_Prospect {get;set;}
        @AuraEnabled public String Goodies {get;set;}
        @AuraEnabled public String remark {get;set;}
        
    }
 }