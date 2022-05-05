public class processBuilderService {
    @InvocableMethod(label='convert leads' description='convert qualified leads' category= 'leads')
    public static List<ID> convertLeads(List<Lead> leads) {
        system.debug(leads);
        if(leads[0].auto_convert_qualified_lead__c){
        Database.LeadConvert lc = new Database.LeadConvert();
        lc.setLeadId(leads[0].Id);
        Id accountId = getAccountId(leads[0]);
        lc.setAccountId(accountId);
        lc.setContactId(getContactId(leads[0],accountId));
        lc.setDoNotCreateOpportunity(true);
        
        LeadStatus convertStatus = [SELECT Id, MasterLabel, IsConverted FROM LeadStatus WHERE IsConverted=true limit 1];
        lc.setConvertedStatus(convertStatus.MasterLabel);
        
        try{
            Database.LeadConvertResult lcResults = Database.convertLead(lc);
        }Catch(Exception exp){
            system.debug('Exception');
            system.debug(exp);
        }
        }
        return null;
    }
    public static Id getAccountId(Lead qualifiedLead){
        List<Account> exisitngAcc = [select id,name from Account where name=:qualifiedLead.Company];
        if(exisitngAcc.size()>0){
            return exisitngAcc[0].Id;
        }else{
            Account acc = new Account(name=qualifiedLead.Company);
            insert acc;
            return acc.Id;
        }
    }
    public static Id getContactId(Lead qualifiedLead,Id accountId){
        List<Contact> exisitngCon = [select id,FirstName,LastName FROM Contact where FirstName=:qualifiedLead.FirstName and LastName=:qualifiedLead.LastName];
        if(exisitngCon.size()>0){
            return exisitngCon[0].Id;
        }else{
            contact con = new contact(FirstName=qualifiedLead.FirstName,LastName=qualifiedLead.LastName,AccountId=accountId);
            insert con;
            return con.Id;
        }
    }
}