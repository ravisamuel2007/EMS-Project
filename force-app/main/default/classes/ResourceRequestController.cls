public with sharing class ResourceRequestController {
    @AuraEnabled
    public static void saveResourceRequestRecord(EMS_Resource_Request__c resObj){
        try{
            system.debug('res Object'+ resObj);
            insert resObj;
        }
        catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
            
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<sObject> search(String searchTerm, string myObject, String filter) {
        String myQuery = null;
        if(filter != null && filter != ''){
            myQuery = 'Select Id, Name from '+myObject+' Where Name Like  \'%' + searchTerm + '%\' AND '+filter+' LIMIT  5';
        }
        else {
            if(searchTerm == null || searchTerm == ''){
                myQuery = 'Select Id, Name from '+myObject+' Where LastViewedDate != NULL ORDER BY LastViewedDate DESC LIMIT  5';
            }
            else {
                myQuery = 'Select Id, Name from '+myObject+' Where Name Like  \'%' + searchTerm + '%\' LIMIT  5';
            }
        }
        List<sObject> lookUpList = database.query(myQuery);
        return lookUpList;
    }

     //fetch picklist values from custom object in lwc
     @AuraEnabled(cacheable=true)
     public static List < customValueWrapper > pickListValueDynamically(sObject customObjInfo, string selectPicklistApi) {
        Schema.DescribeSObjectResult objDescribe = customObjInfo.getSObjectType().getDescribe();     
        map < String, Schema.SObjectField > customFieldMap = objDescribe.fields.getMap();      
        list < Schema.PicklistEntry > custPickValues = customFieldMap.get(selectPicklistApi).getDescribe().getPickListValues();
        list < customValueWrapper > customObjWrapper = new list < customValueWrapper > ();
        for (Schema.PicklistEntry myCustPick: custPickValues) {
          customValueWrapper selectOptionValueWrapper = new customValueWrapper();
             selectOptionValueWrapper.custFldlabel = myCustPick.getLabel();
             selectOptionValueWrapper.custFldvalue = myCustPick.getValue();
            customObjWrapper.add(selectOptionValueWrapper);
        }
        
        return customObjWrapper;
  
      }
      // wrapper class 
        public with sharing class customValueWrapper {
          @auraEnabled public string custFldlabel {get;set;}
          @auraEnabled public string custFldvalue {get;set;}
        } 
        @AuraEnabled(cacheable=true)
        public static String fetchDependentPicklistValues(){
            Map<String,List<Map<String,List<String>>>> MapOfDependentPicklsit = new Map<String,List<Map<String,List<String>>>>();
            // for(AggregateResult ag : [select Type, Rating, Industry from Account where Type!=null and Rating!=null and Industry!=null Group By Type, Rating, Industry]){
            //     Map<String,List<String>> mapOfRatingAndIndustry = new Map<String,List<String>>();
            //     if(mapOfRatingAndIndustry.containsKey(String.valueOf(ag.get('Rating')))){
            //         mapOfRatingAndIndustry.get(String.valueOf(ag.get('Rating'))).add(String.valueOf(ag.get('Industry')));
            //     }else{
            //         mapOfRatingAndIndustry.put(String.valueOf(ag.get('Rating')),new List<String>{String.valueOf(ag.get('Industry'))});
            //     }
            //     if(MapOfDependentPicklsit.containsKey(String.valueOf(ag.get('Type')))){
            //         MapOfDependentPicklsit.get(String.valueOf(ag.get('Type'))).add(mapOfRatingAndIndustry);
            //     }else{
            //         MapOfDependentPicklsit.put(String.valueOf(ag.get('Type')),new List<Map<String,List<String>>>{mapOfRatingAndIndustry});
            //     }
            // }
            for(EMS_Resource_Request__c ag : [select EMS_Industry__c, EMS_Domain_Technology__c, EMS_Job_Role__c from EMS_Resource_Request__c ]){
                Map<String,List<String>> mapOfTechAndJobRole = new Map<String,List<String>>();
                if(mapOfTechAndJobRole.containsKey(String.valueOf(ag.get('EMS_Domain_Technology__c')))){
                    mapOfTechAndJobRole.get(String.valueOf(ag.get('EMS_Domain_Technology__c'))).add(String.valueOf(ag.get('EMS_Job_Role__c')));
                }else{
                    mapOfTechAndJobRole.put(String.valueOf(ag.get('EMS_Domain_Technology__c')),new List<String>{String.valueOf(ag.get('EMS_Job_Role__c'))});
                }
                if(MapOfDependentPicklsit.containsKey(String.valueOf(ag.get('EMS_Industry__c')))){
                    MapOfDependentPicklsit.get(String.valueOf(ag.get('EMS_Industry__c'))).add(mapOfTechAndJobRole);
                }else{
                    MapOfDependentPicklsit.put(String.valueOf(ag.get('EMS_Industry__c')),new List<Map<String,List<String>>>{mapOfTechAndJobRole});
                }
            }
            System.debug('Map Dep-->'+MapOfDependentPicklsit);
            System.debug('Map Ser-->'+JSON.serialize(MapOfDependentPicklsit));
            return JSON.serialize(MapOfDependentPicklsit);
        }
}