public class CreateJobAppController {
    public CreateJobAppController(){

        
    }
     @AuraEnabled
    public static boolean DoesApplicationExist(Id recordId){
        
            
            String UserEmail = UserInfo.getUserEmail();
            EMS_Applicant__c app = [select id,Email__c from EMS_Applicant__c where Email__c=:UserEmail];
            EMS_Job_Opening__c JobOpening = [select id from EMS_Job_Opening__c where id=:recordId limit 1];
            
            List<EMS_Job_Application__c> ExistingApp = [select id,EMS_Job_Opening__c,EMS_Applicant__c from EMS_Job_Application__c where EMS_Job_Opening__c=:JobOpening.id AND EMS_Applicant__c=:app.id];
             if(ExistingApp.isEmpty())
            	return false;
        	 else 
            	return true;
            
       /* } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }*/
    }
    
     @AuraEnabled
    public static boolean createRecord(Id recordId){
        try{
        String UserEmail = UserInfo.getUserEmail();
            System.debug('UserEmail-->' + UserEmail);
            EMS_Applicant__c app = [select id,Email__c from EMS_Applicant__c where Email__c=:UserEmail];
            EMS_Job_Opening__c JobOpening = [select id from EMS_Job_Opening__c where id=:recordId limit 1];
            
            EMS_Job_Application__c JobApp = new EMS_Job_Application__c();
            JobApp.EMS_Applicant__c = app.id;
            JobApp.EMS_Job_Opening__c = JobOpening.Id;
            JobApp.Status__c = 'Sumitted';
            insert JobApp;
         return true;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
           
    }

}