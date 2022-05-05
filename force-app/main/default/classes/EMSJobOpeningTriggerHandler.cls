public class EMSJobOpeningTriggerHandler {
	public static void restrictDelete(List<EMS_Job_Opening__c> jobOpeningList){
        for(EMS_Job_Opening__c jo : jobOpeningList){
            jo.addError('You are not allowed to delete record. Contact Admin!');
        }
    }
}