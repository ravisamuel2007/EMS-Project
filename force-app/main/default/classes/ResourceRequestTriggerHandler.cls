public class ResourceRequestTriggerHandler {
    public static void createJobOpening(List<EMS_Resource_Request__c> ResourceRequestList){
        List<EMS_Job_Opening__c>JobOpeningList = new List<EMS_Job_Opening__c>();
        for(EMS_Resource_Request__c ERR : ResourceRequestList){
            if(ERR.Is_Approved__c == true){
                EMS_Job_Opening__c JO = new EMS_Job_Opening__c();
                JO.EMS_Industry__c = ERR.EMS_Industry__c;
                JO.EMS_Domain_Technology__c = ERR.EMS_Domain_Technology__c;
                JO.EMS_Job_Location__c = ERR.EMS_Job_Location__c;
                JO.EMS_Job_role__c = ERR.EMS_Job_Role__c;
                JO.EMS_Vacant_Positions__c = ERR.EMS_Vacant_Positions__c;
                JO.EMS_Key_Skills__c= ERR.EMS_Key_Skills__c;
                JO.EMS_Posting_Title__c = ERR.EMS_Requirement_Title__c;
                JO.EMS_Nice_to_Have_Skills__c = ERR.EMS_Nice_to_Have_Skills__c;
                JO.EMS_Required_Qualification__c = ERR.EMS_Required_Qualification__c;
                JO.EMS_Years__c = ERR.EMS_Years__c;
                //JO.EMS_Months__c = ERR.EMS_Months__c;
                JO.EMS_Company_Information__c = ERR.EMS_Company_Information__c;
                JO.EMS_Roles_and_Responsibilities__c = ERR.EMS_Roles_and_Responsibilities__c;
                JO.EMS_Job_Description__c = ERR.EMS_Job_Description__c;
                JO.Foreign_Key__c = ERR.EMS_Foreign_Key__c;
                Jo.EMS_Project__c = ERR.EMS_Project_Id__c;
                Jo.EMS_Resource_Type__c = ERR.EMS_Resource_Type__c;
                Jo.EMS_Status__c = 'Approved';
                JobOpeningList.add(JO);
            }          
        }
        if(JobOpeningList.size()>0)
         insert JobOpeningList;
    }

    public static void updateJobDescriptionBeforeInsert(List<EMS_Resource_Request__c> ResourceRequestList){
        Map<String,EMS_Job_Description__c> mapJobDesc = new Map<String,EMS_Job_Description__c>();
        String resReqKey = ' ';
        String jdKey = ' ';
        String tempRoles = ' ';
        String tempJD = ' ';
        List<EMS_Job_Description__c> jobDescList = [Select Id,EMS_Company_Information__c,EMS_Domain_Technology__c,
                                                    EMS_Industry__c,EMS_Job_Description__c,EMS_Job_Role__c,
                                                    EMS_Roles_and_Responsibilities__c From EMS_Job_Description__c];
        if(jobDescList.size()>0){
            for(EMS_Job_Description__c jd : jobDescList){
                if(jd.EMS_Industry__c !='' && jd.EMS_Industry__c != null && jd.EMS_Domain_Technology__c!='' && jd.EMS_Domain_Technology__c != null && jd.EMS_Job_Role__c!='' && jd.EMS_Job_Role__c != null){
                 jdKey = jd.EMS_Industry__c+'-'+jd.EMS_Domain_Technology__c+'-'+jd.EMS_Job_Role__c;
                 mapJobDesc.put(jdKey,jd);
                }
             }                                            
        }
                                                   
        for(EMS_Resource_Request__c ERR : ResourceRequestList){
            if(Err.EMS_Status__c == null){
                Err.EMS_Status__c = 'Open';
            } 
            if(ERR.EMS_Industry__c != null && ERR.EMS_Domain_Technology__c != null  && ERR.EMS_Job_Role__c != null){
            resReqKey = ERR.EMS_Industry__c+'-'+ERR.EMS_Domain_Technology__c+'-'+ERR.EMS_Job_Role__c;
               
            if(mapJobDesc.containskey(resReqKey)){
                    tempJD = Err.EMS_Job_Description__c;
                    if(tempJD != null){
                        Err.EMS_Job_Description__c = mapJobDesc.get(resReqKey).EMS_Job_Description__c + '\n ' + tempJD;
                    }else{
                        Err.EMS_Job_Description__c = mapJobDesc.get(resReqKey).EMS_Job_Description__c ;
                    }
                    Err.EMS_Company_Information__c = mapJobDesc.get(resReqKey).EMS_Company_Information__c;
                
                    tempRoles = Err.EMS_Roles_and_Responsibilities__c;
                    if(tempRoles !=null){
                        Err.EMS_Roles_and_Responsibilities__c = mapJobDesc.get(resReqKey).EMS_Roles_and_Responsibilities__c + '\n ' + tempRoles;
                    }else{
                        Err.EMS_Roles_and_Responsibilities__c = mapJobDesc.get(resReqKey).EMS_Roles_and_Responsibilities__c;
                    }                    
                }
            }  
            // if(ERR.EMS_Industry__c != null &&  ERR.EMS_Domain_Technology__c != null &&  ERR.EMS_Job_Role__c == 'Other'){
            //     Err.EMS_Job_Description__c = 'Job Description not Found';
            //     Err.EMS_Roles_and_Responsibilities__c = 'Roles and Responsibilities not found';
            // }  
        }
    }
    // public static void JobDescRolesAndRespAfterUpdate(List<EMS_Resource_Request__c> ResourceRequestList,Map<Id,EMS_Resource_Request__c> ResourceRequestOldMap){
    //     Map<String,EMS_Job_Description__c> mapJobDesc = new Map<String,EMS_Job_Description__c>();
    //     String tempRoles = ' ';
    //     String tempJD = ' ';
    //     String resReqKey = ' ';
    //     String jdKey = ' ';
    //     List<EMS_Job_Description__c> jobDescList = [Select Id,EMS_Company_Information__c,EMS_Domain_Technology__c,
    //                                                 EMS_Industry__c,EMS_Job_Description__c,EMS_Job_Role__c,
    //                                                 EMS_Roles_and_Responsibilities__c From EMS_Job_Description__c];
    //     if(jobDescList.size()>0){
    //         for(EMS_Job_Description__c jd : jobDescList){
    //             if(jd.EMS_Industry__c != null && jd.EMS_Domain_Technology__c != null && jd.EMS_Job_Role__c != null){
    //                 jdKey = jd.EMS_Industry__c+'-'+jd.EMS_Domain_Technology__c+'-'+jd.EMS_Job_Role__c;
    //                 mapJobDesc.put(jdKey,jd);
    //             }
    //         }                                            
    //     }                                                                                             
    //     List<EMS_Resource_Request__c> listResReq = new List<EMS_Resource_Request__c>();
    //     for(EMS_Resource_Request__c err : ResourceRequestList){
    //         String oldJD = ResourceRequestOldMap.get(err.Id).EMS_Job_Description__c;
    //         String oldRolesAndResp = ResourceRequestOldMap.get(err.Id).EMS_Roles_and_Responsibilities__c;
    //         String oldJobRole = ResourceRequestOldMap.get(err.Id).EMS_Job_Role__c;
    //         if(oldJobRole != err.EMS_Job_Role__c && err.EMS_Job_Role__c != 'Other'){
    //                 resReqKey = ERR.EMS_Industry__c+'-'+ERR.EMS_Domain_Technology__c+'-'+ERR.EMS_Job_Role__c;    
    //                 if(mapJobDesc.containskey(resReqKey)){
    //                         tempJD = Err.EMS_Job_Description__c;
    //                         if(tempJD != null){
    //                             Err.EMS_Job_Description__c = mapJobDesc.get(resReqKey).EMS_Job_Description__c + '\n ' + tempJD;
    //                         }else{
    //                             Err.EMS_Job_Description__c = mapJobDesc.get(resReqKey).EMS_Job_Description__c ;
    //                         }
    //                         //Err.EMS_Company_Information__c = mapJobDesc.get(resReqKey).EMS_Company_Information__c;
                        
    //                         tempRoles = Err.EMS_Roles_and_Responsibilities__c;
    //                         if(tempRoles !=null){
    //                             Err.EMS_Roles_and_Responsibilities__c = mapJobDesc.get(resReqKey).EMS_Roles_and_Responsibilities__c + '\n ' + tempRoles;
    //                         }else{
    //                             Err.EMS_Roles_and_Responsibilities__c = mapJobDesc.get(resReqKey).EMS_Roles_and_Responsibilities__c;
    //                         }                    
    //                     }   
    //         }
    //         listResReq.add(err);
    //     }
    //     if(listResReq.size()>0){
    //         update listResReq;
    //     }
    // }

    public static void JobDescRolesAndRespAfterUpdate(List<EMS_Resource_Request__c> ResourceRequestList,Map<Id,EMS_Resource_Request__c> ResourceRequestOldMap){
        List<EMS_Resource_Request__c> rrList = new List<EMS_Resource_Request__c>();
        String tempRoles = ' ';
        String tempJD = ' ';
        for(EMS_Resource_Request__c err : ResourceRequestList){
            String oldJD = ResourceRequestOldMap.get(err.Id).EMS_Job_Description__c;
            String oldRolesAndResp = ResourceRequestOldMap.get(err.Id).EMS_Roles_and_Responsibilities__c;
            String oldJobRole = ResourceRequestOldMap.get(err.Id).EMS_Job_Role__c;
            if(err.EMS_Job_Role__c != 'Other'){
                err.EMS_Job_Description__c = oldJD + '\n' + err.EMS_Job_Description__c;
                err.EMS_Roles_and_Responsibilities__c = oldRolesAndResp + '\n' + err.EMS_Roles_and_Responsibilities__c;
            }
            // rrList.add(err);
        }
        // if(rrList.size()>0){
        //     update rrList;
        // }
    }

    public static void updateJobDescriptionBeforeUpdate(List<EMS_Resource_Request__c> ResourceRequestList){
        Map<String,EMS_Job_Description__c> mapJobDesc = new Map<String,EMS_Job_Description__c>();
        String resReqKey = ' ';
        String jdKey = ' ';
        String tempRoles = ' ';
        String tempJD = ' ';
        List<EMS_Job_Description__c> jobDescList = [Select Id,EMS_Company_Information__c,EMS_Domain_Technology__c,
                                                    EMS_Industry__c,EMS_Job_Description__c,EMS_Job_Role__c,
                                                    EMS_Roles_and_Responsibilities__c From EMS_Job_Description__c];
        if(jobDescList.size()>0){
            for(EMS_Job_Description__c jd : jobDescList){
                if(jd.EMS_Industry__c !='' && jd.EMS_Industry__c != null && jd.EMS_Domain_Technology__c!='' && jd.EMS_Domain_Technology__c != null && jd.EMS_Job_Role__c!='' && jd.EMS_Job_Role__c != null){
                 jdKey = jd.EMS_Industry__c+'-'+jd.EMS_Domain_Technology__c+'-'+jd.EMS_Job_Role__c;
                 mapJobDesc.put(jdKey,jd);
                }
             }                                            
        }
                                                   
        for(EMS_Resource_Request__c ERR : ResourceRequestList){
            if(Err.EMS_Status__c == null){
                Err.EMS_Status__c = 'Open';
            }
            if(ERR.EMS_Industry__c!='' && ERR.EMS_Industry__c != null && ERR.EMS_Domain_Technology__c!='' && ERR.EMS_Domain_Technology__c != null && ERR.EMS_Job_Role__c!='' && ERR.EMS_Job_Role__c != null){
            resReqKey = ERR.EMS_Industry__c+'-'+ERR.EMS_Domain_Technology__c+'-'+ERR.EMS_Job_Role__c;
            
                if(mapJobDesc.containskey(resReqKey)){
                    //tempJD = Err.EMS_Job_Description__c;
                    if(tempJD != null){
                        Err.EMS_Job_Description__c = mapJobDesc.get(resReqKey).EMS_Job_Description__c ;
                    }
                    Err.EMS_Company_Information__c = mapJobDesc.get(resReqKey).EMS_Company_Information__c;
                    
                    
                    //tempRoles = Err.EMS_Roles_and_Responsibilities__c;
                    if(tempRoles !=null){
                        Err.EMS_Roles_and_Responsibilities__c = mapJobDesc.get(resReqKey).EMS_Roles_and_Responsibilities__c ;
                    }                  
                }
            }
            if(ERR.EMS_Industry__c != null &&  ERR.EMS_Domain_Technology__c != null &&  ERR.EMS_Job_Role__c == 'Other'){
                Err.EMS_Job_Description__c = 'Job Description not Found';
                Err.EMS_Roles_and_Responsibilities__c = 'Roles and Responsibilities not found';
            }    
        }
    }
    public static void restrictSubmitForApproval(List<EMS_Resource_Request__c> ResourceRequestList,Map<Id,EMS_Resource_Request__c> ResourceRequestOldMap){
        for(EMS_Resource_Request__c rr : ResourceRequestList){
            EMS_Resource_Request__c oldRecord = ResourceRequestOldMap.get(rr.Id);
             if(oldRecord.Is_Approved__c == true){
                 rr.addError('The record is already approved ! You cannot edit or Submit it for approval again');
             }
        }
    }

    public static void restrictDelete(List<EMS_Resource_Request__c> ResourceRequestList){
        for(EMS_Resource_Request__c rr : ResourceRequestList){
            rr.addError('You are not allowed to delete record. Contact Admin!');
        }
    }
}