public with sharing class EMS_ApplicantRegistrationController {

    private static final String CRYPTO_KEY = '1234509876123409';
    private static final String AES128 = 'AES128';
    
    @AuraEnabled
    public static void saveNewApplicant(EMS_Applicant_Credentials__c applicant){
        applicant.Password__c = encryptPassword(applicant.Password__c);
        applicant.One_Time_Passcode__c = generateRandomOtp();
        insert applicant;
    }

    @AuraEnabled
    public static Boolean loginApplicant(Map<String,String> loginCredentials){
        EMS_Applicant_Credentials__c applicant = [SELECT Id, Email__c,Password__c FROM EMS_Applicant_Credentials__c WHERE Email__c =: loginCredentials.get('email') LIMIT 1];
        String decryptedPassword = decryptPassword(applicant.Password__c);
        return decryptedPassword == loginCredentials.get('password');
    }


    private static Integer generateRandomOtp(){
        return Integer.valueof((Math.random() * 999999));
    }

    private static String encryptPassword(String password){
        Blob key = Blob.valueOf(CRYPTO_KEY);
        Blob encryptedPassword = Crypto.encryptWithManagedIV(AES128, key, Blob.valueOf(password));
        return EncodingUtil.base64Encode(encryptedPassword);
    }

    private static String decryptPassword(String encryptedPassword){
        Blob key = Blob.valueOf(CRYPTO_KEY);
        Blob encodedPassword = EncodingUtil.base64Decode(encryptedPassword);
        Blob decryptedPassword = Crypto.decryptWithManagedIV(AES128, key, encodedPassword);
        return decryptedPassword.toString();
    } 
}