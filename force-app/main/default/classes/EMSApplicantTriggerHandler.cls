public class EMSApplicantTriggerHandler {
    public static void restrictDuplicateApplicant(List<EMS_Applicant__c> appcntList) {
        Map<String,EMS_Applicant__c> phoneMap = new Map<String,EMS_Applicant__c>();
        Profile p = [Select Name from Profile where Id =: userinfo.getProfileid()];
        String pname = p.name;
        if(pname != 'System Administrator'){
            Integer maxApplicants = 1;
            Set<String> setEmail = new Set<String>();   
            Map<String,Integer> appEmailVsCount = new Map<String,Integer>();
            For(EMS_Applicant__c applicant : appcntList)        
            {      
                if(appEmailVsCount.containsKey(applicant.Email__c))
                    applicant.addError('Applicant Email is already exists');
                else
                    appEmailVsCount.put(applicant.Email__c,1);
                setEmail.add(applicant.Email__c);
            }
            if(setEmail.size() > 0 )
            {        
                List<EMS_Applicant__c> lstApplicant = [select Email__c ,id from EMS_Applicant__c where Email__c in :setEmail ];
                Map<String ,EMS_Applicant__c> mapEmailWiseApplicant = new Map<String,EMS_Applicant__c>();        
                For(EMS_Applicant__c applicant: lstApplicant)            
                {            
                    mapEmailWiseApplicant.put(applicant.Email__c ,applicant);            
                }
                
                system.debug(mapEmailWiseApplicant.size());
                For(EMS_Applicant__c applicant : appcntList)            
                {            
                    if(mapEmailWiseApplicant.containsKey(applicant.Email__c))
                    {
                        applicant.Email__c.addError('A profile with this email already exists ');
                    }
                    
                }
                if(lstApplicant.size()>maxApplicants){
                    appcntList[0].addError('Dear user you have exceeded creating the maximum number of Applicants .');
                }
                
            }
        }
        For(EMS_Applicant__c applicant : appcntList){
            if(applicant.EMS_Phone_Number__c != null){
                phoneMap.put(applicant.EMS_Phone_Number__c,applicant);
            }
        }
        if(phoneMap.size()>0){
            List<EMS_Applicant__c> applList = [Select Id from EMS_Applicant__c Where EMS_Phone_Number__c IN :phoneMap.keyset()];
            if(applList.size()>0){
                For(EMS_Applicant__c applicant : appcntList){
                    if(phoneMap.containsKey(applicant.EMS_Phone_Number__c)){
                        applicant.addError('Record with same phone number is already exist');
                    }
                }
            }
        }
    }
}

/*
Set<String> setName = new Set<String>();   
Map<String,Integer> accnamesVsCount = new Map<String,Integer>();
For(Account acc : trigger.new)        
{      
    if(accnamesVsCount.containsKey(acc.Name))
        acc.addError('Account Name is already exists');
    else
        accnamesVsCount.put(acc.Name,1);
    setName.add(acc.name);
}
if(setName.size() > 0 )
{        
    List<Account> lstAccount = [select name ,id from account where name in :setName ];
    Map<String ,Account> mapNameWiseAccount = new Map<String,Account>();        
    For(Account acc: lstAccount)            
    {            
        mapNameWiseAccount.put(acc.name ,acc);            
    }
    
    system.debug(mapNameWiseAccount.size());
    For(Account acc : trigger.new)            
    {            
        if(mapNameWiseAccount.containsKey(acc.name))
        {
            acc.Name.addError('Name already Exist ');
        }
    }
}


Integer maxApplcnts = null;

Set<Id> userIds = new Set<Id>();
Map<Id, Integer> applcntCountMap = new Map<Id, Integer>();

for (EMS_Applicant__c c: AppcntList) {
    userIds.add(c.OwnerId);
    applcntCountMap.put(c.OwnerId, 0);
}

Map<Id, User> userMap = new Map<Id, User>([
    select EMS_Email__c
    from User
    where Id in :userIds
]);

for (AggregateResult result: [
    select count(Id)
    from EMS_Applicant__c
]) {
    applcntCountMap.put((Id) result.get('OwnerId'), (Integer) result.get('expr0'));
}

for (EMS_Applicant__c emailapplcnt: AppcntList) {
    applcntCountMap.put(emailapplcnt.OwnerId, applcntCountMap.get(emailapplcnt.OwnerId) + 1);
    
    if (applcntCountMap.get(emailapplcnt.OwnerId) > maxApplcnts) {
        emailapplcnt.addError('Too many applicants created this month for user ' + userMap.get(c.OwnerId).Name + '(' + c.OwnerId + '): ' + maxApplcnts);
    }
}
}
} 

id UserId = UserInfo.getUserId();
List<EMS_Applicant__c> ApplicantList= [select Id,EMS_Email__c,CreatedById from EMS_Applicant__c  where CreatedById=:UserInfo.GetUserId()];
interger count=  ApplicantList.Size();
system.debug('count is---'+count);
for(EMS_Applicant__c appcnt:ApplicantList){
    if(count>=1){
        appcnt.addError('Dear user you have exceeded the maximum number of Applicants allowed.');
    }  
}
}
}*/