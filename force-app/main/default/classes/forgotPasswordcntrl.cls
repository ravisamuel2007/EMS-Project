public with sharing class forgotPasswordcntrl {
    @AuraEnabled(cacheable=true)
    
        public static void ApplicantCredentials(string mail){
            EMS_Applicant_Credentials__c ApplicantRecord = [Select id, Name,Email__c from EMS_Applicant_Credentials__c WHERE Email__c =:mail];
            string Applicantmail = ApplicantRecord.Email__c;
            string ApplicantId = ApplicantRecord.id;

            String subject = 'Reset Password ';
            string body = 'Please click on below link to reset your password'+
            'https://cloudperitus-developer-edition.na162.force.com/ema/s/user-forgot-password-redirectinguserpassword?ApplicantId='+ApplicantId;
            // Define the email
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage(); 
        // Now sets the below paramaters of the email object
        email.setSubject( subject );
        // Here I am accessing current user email id to whom we are sending email
        email.setToAddresses( new String[] {Applicantmail} );
        email.setPlainTextBody( body );
        // Sends the email
        Messaging.SendEmailResult [] r = Messaging.sendEmail(new Messaging.SingleEmailMessage[] {email});  
      }
}