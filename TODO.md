#SECURITY

##LOCAL STORAGE
1.INFO SHOULD BE HELD ENCRYPTED

## RESET PASSWORD
1. WE SHOULD CHECK IF RESET PASSWORD HAS AN EXPIRED TOKEN MECHANISM

#REQUEST RESPONSE CYCLE
## 1.Problem details response body does not return after token refresh middleawre executed, it goes to the exception middleware but response does not have body, only response code.
## 2.Confirm email page sends two request, therefore a concurrency error occurs.


## DEVELOPMENT FLOW:
1.Aside development.
2.Changing main page when user  is authenticated
3.api & db should be deployed.
4.CREATE A DIET CREATION PAGE.
5.CONNECT CREATE CLIENT, CLIENT LIST, CLIENT DETAILS TO BACKEND,