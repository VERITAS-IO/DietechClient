TO CONTINUE:
- UPDATE MEAL DIALOG WILL BE CREATED.


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


