public without sharing class EMS_ApplicantRegistrationController {

    private static final String CRYPTO_KEY = '1234509876123409';
    private static final String AES128 = 'AES128';
    private static final String HOME = 'home';
    private static final String VERIFY_OTP = 'verify_otp';
    private static final String AUTHENTICATION_FAILED = 'authentication_failed';
    
    @AuraEnabled
    public static void saveNewApplicant(EMS_Applicant_Credentials__c applicant){
        applicant.Password__c = encryptPassword(applicant.Password__c);
        applicant.One_Time_Passcode__c = generateRandomOtp();
        insert applicant;
    }

    @AuraEnabled
    public static String loginApplicant(Map<String,String> loginCredentials){
        try{
            EMS_Applicant_Credentials__c applicant = [SELECT Id, Email__c,Password__c,Is_OTP_Verified__c FROM EMS_Applicant_Credentials__c WHERE Email__c =: loginCredentials.get('email') LIMIT 1];
            String decryptedPassword = decryptPassword(applicant.Password__c);
            String result = '';
            if(decryptedPassword == loginCredentials.get('password')){
                result =  applicant.Is_OTP_Verified__c ? HOME : VERIFY_OTP;
            }
            else{
                result = AUTHENTICATION_FAILED;
            }
            return result;
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Boolean verifyOTP(Integer otp, String email){
        try {
            
            EMS_Applicant_Credentials__c applicant = [SELECT Id, One_Time_Passcode__c,OTP_Generated_Date_Time__c FROM EMS_Applicant_Credentials__c WHERE Email__c =: email LIMIT 1];
            Long optGeneratedMinutes = (DateTime.now().getTime() - applicant.OTP_Generated_Date_Time__c.getTime())/60000;
            Boolean verified = false;
            if(applicant.One_Time_Passcode__c == otp && optGeneratedMinutes <= 30){
                applicant.Is_OTP_Verified__c = true;
                applicant.Send_OTP__c = false;
                verified = true;
            }
            else{
                applicant.Is_OTP_Verified__c = false;
                applicant.Send_OTP__c = false;
                verified = false;
            }
            update applicant;
            return verified;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static void resentOTP(Integer otp, String email){
        try{
            EMS_Applicant_Credentials__c applicant = [SELECT Id FROM EMS_Applicant_Credentials__c WHERE Email__c =: email LIMIT 1];
            applicant.One_Time_Passcode__c = generateRandomOtp();
            applicant.Is_OTP_Verified__c = false;
            applicant.Send_OTP__c = true;
            applicant.OTP_Generated_Date_Time__c = System.now();
            update applicant;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    private static Integer generateRandomOtp(){
        return Math.round((Math.random() * (900000) + 100000));
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