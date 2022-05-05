public with sharing class JobDescriptionTriggerHandler {
    public static void preventDeleteRecod(List<EMS_Job_Description__c> jobDescList){
        for(EMS_Job_Description__c jd : jobDescList){
            jd.addError('You are not allowed to delete record. Contact Admin!');
        }
    }

    public static void preventDuplicateRecod(List<EMS_Job_Description__c> listJobDesc){
        string uniqueKey;
        string jdKey;
        Map<String,EMS_Job_Description__c> mapKeyJobDesc = new Map<String,EMS_Job_Description__c>();
        List<EMS_Job_Description__c> listJD = [Select EMS_Industry__c,EMS_Domain_Technology__c,
                                                    EMS_Job_Role__c From EMS_Job_Description__c];    
    if(listJD.size()>0){
        for(EMS_Job_Description__c jd : listJD){
             jdKey = jd.EMS_Industry__c+'-'+jd.EMS_Domain_Technology__c+'-'+jd.EMS_Job_Role__c;
             mapKeyJobDesc.put(jdKey,jd);
            }
         }
    for(EMS_Job_Description__c jd : listJobDesc){
            uniqueKey = jd.EMS_Industry__c+'-'+jd.EMS_Domain_Technology__c+'-'+jd.EMS_Job_Role__c;
            if(mapKeyJobDesc.containskey(uniqueKey)){
                jd.addError('Record with same Department, Domain and Job Role already exist');
            }
        }
    }
}