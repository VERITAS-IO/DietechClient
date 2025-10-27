TO CONTINUE:
- WHEN WE TRY TO DELETE A MEAL, THE DELETE MEAL DIALOG IS NOT BEING OPEN, BECAUSE MEAL IDS ARE NOT COMING FROM BACKEND

#SECURITY

##LOCAL STORAGE
1.INFO SHOULD BE HELD ENCRYPTED

## RESET PASSWORD
1. WE SHOULD CHECK IF RESET PASSWORD HAS AN EXPIRED TOKEN MECHANISM

#REQUEST RESPONSE CYCLE
## 1.Problem details response body does not return after token refresh middleawre executed, it goes to the exception middleware but response does not have body, only response code.
## 2.Confirm email page sends two request, therefore a concurrency error occurs.
## 3.RepositoryBase methods in should get a TenantId as a parameter, and this should be get from token claims.

## DEVELOPMENT FLOW:
1.Aside development [DONE]
2.Changing main page when user  is authenticated
3.Connect pages to backend with real data.[DONE]
4.CREATE A DIET CREATION PAGE.
5.api & db should be deployed.

    ##DIETS:
    1.meal (ogun) will be added to diets.(IT WILL CHANGE MOSTLY.)

    ##PAGINATION:
    1. Create a pagination logic on the frontend according to metadata object, (it will get from headers)

    ### APPOINTMENTS
    1.AppointmentNotes should be a seperate table. [DONE]

    ### TENANTS
    1.How to add users to tenants
        1.A user registers.
        2.User adds emails as users to tenant.
        3.An invitation link sent to these emails.
        4.Invited emails click the link and register.
        5.When we create the user, we set the user's tenant id as the value we sent within the invitation token.

    

## HTTP 

-RETURN 412 - PRECONDITION FAILED IN THE SERVICES WITH PRECONDITIONS.






Prompt:   I want to build a KYC Flow system, this kyc flow will have 2 steps. First step will be the IdCard step, second one will be the Liveness test. We also  need to have an AML (Anti Money Laundering) for the customer.   1.STRUCTURE: 
1.1.Business
 - Our system will be a multi-tenant system. 
 - We can call users of the tenants as profiles. So a person that does kyc is a profile.  - If a profile exists on the system, we should not recreate it, we just need to restart the infos, archive the documents.  - A profile’s status could be updated, documents should be archived or deleted.   - It will be a multi-nation supporting system.   - I want do something new and I want to create a new KYC flow with LLMs. Therefore our system will work with prompts.   - For each nation, we will have different sets of prompts of IdCard validation and Liveness test.  - For IdCard, we need a MRZ and OCR validation.   - For each nation, IdCard may vary, therefore, we should support DriverLicense or Passport too.  - For liveness test, we will have some common set of prompts for all nations.  	These can be called as step configurations. For example: 		- Glasses are accepted.  		- Sunglasses are not accepted  		- Or any other things  that can be configured for that   - For liveness, we can select a selfie or a pose estimation flow.  	- Selfie just will be a simple front face selfie.  	- Pose estimation will be of a 4 photos (straight to the camera looking, turning your face to right and left, and looking up) 	- Pose estimation or selfie can be decided by configurations. 	- Pose estimation or selfie again, can be configured by prompts.   - A tenant can update its two steps flows. 	- A liveness test cannot be uploaded if user is not uploaded an IdCard.  1.2. Flow

- Our structure will be 2 steps, IdCard and Liveness steps.  
- Flow should be configurable, some tenants may just need id card upload, some just need selfie, some may need both. If they need both, we should prevent uploading of selfie before uploading of IdCard. Therefore, this also should be configurable for the tenants.
- If the required conditions by the tenant are satisfied, we will set the profile’s status to approved. 
- A profile can have 3 statuses,  Approved, Rejected, Created or Incompleted.
- When a profile is created, its value is created.
- A profile can be rejected under the following circumstances:
    - Uploaded document or documents may be rejected.
    - A profile can be rejected on IdCard step, or Selfie step. It does not have to wait for whole flow to finish. 
    - Documents can be uploaded for a rejected profile again and again. That is not a problem
- A profile can be Approved when the flow that is decided by the tenant is satisfied. That may be:
    - Uploading only IdCard
    - Uploading only Liveness test whether its selfie or pose estimation
    - Uploading both..   

- If a profile recreated, its status should be resetted to Created, its all documents should be archived. And Archived documents should be archived documents

1.3. Reasons
	- Our rejections should have reasons. Reasons can be related to IdCard or Liveness test. Kyc flows have a lot of rejection reasons. One example could be IdCard photo and Liveness test face not being same. Examples can be multiplied. 	- Reasons should be specialized for IdCard for different nations, but common for IdCard -  Liveness test relations. 
1.4. Application Requirements: 
    - We need a backend application. 
    - Application code should be very simple, nothing fancy or shiny. KEEP IT SIMPLE AND STUPID. 
    - Do not create things that we are not going to need
    - Write the code in the most simple and state of art way, no complex logics, nothing fancy, just straight to the point, readable code.

1.5. Backend / Frontend Applications
    - We are going to need a service of course, this service will be written with Express.js framework.
    - I want to write a Dashboard application where tenants can login and configure all configurables for their business' KYC Flow and see their customer's Profiles. 

    1.5.1 Backend Requirements:
        - 1.5.1.1. Authentication 
            - Every tenant is going to have a way to use our services. Authentication method should be decided by the most state of art / cutting edge solution. 
            - Permissions for these users should be configurable by us. 
        - 1.5.1.2. Rate Limiting / IP Whitelisting
            - Our backend should have rate limiting for endpoints and of course ip whitelistings. 
            - I want a swagger configuration to be implemented. 
        - 1.5.1.3. Security 
            - We need to implement most important security aspects such as using Helmet etc, implement all necessary security aspects. 
        - 1.5.1.4. Error handling / 404 Handling
            - Please impelment a global error handling and a 404 handling.

    1.5.1. Dashboard Requirements: 
        - I might be able to create a user for our tenants, this user will be used in apis and also to enter the dashboard. 
        - Tenants should be able to do all the configurations that we mentioned above about kyc flows or their customers' profiles.
        - Tenants should be able to search their customers' profiles and see the detail of the profiles.
        - Tenants should be able to see the uploaded documents for the most recent creation.
        - As we mentioned before, if a profile is being tried to created more than one, documents should be archived, in the dashboard, in the customer's profile detail page, these archived documents and their statueses should be present. 
        - Uploaded documents for a profile should be present with theirs statuses (Approved, Rejected, NotUploaded)

1.6. TECH STACK
    I want our backend to be in Express.js
    I want our frontend to be in a simple server side rendered Next.js
        - Do not use anything unnecessary.
        - You can use Zustand for state management.