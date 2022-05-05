trigger ApplicantTrigger on EMS_Applicant__c (before insert) {
    if(Trigger.IsInsert && Trigger.isBefore){
    EMSApplicantTriggerHandler.restrictDuplicateApplicant(Trigger.New);
    }
}