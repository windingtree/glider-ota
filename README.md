## Glider OTA

This repository contains code of Glider OTA  
It includes both:
* Frontend
  * React application
  * bootstrapped with create-react-app
  
* Backend
  * REST API that is used by frontend 
  * it is NodeJS backend 
  * API endpoints are developed as lambda functions to be deployed in vercel.com cloud 

### Prerequisites
In order to use all application capabilities, you will need to have the following integrations/accounts:
* have ORGiD profile at Winding Tree marketplace
  * at least one private key added to your organisation profile 
* access to mongodb instance - as a persistence layer
  * database needs to be initialized with some initial data (ref next section )
* access to redis instance - for caching purposes
* vercel.com account - application backend is developed with assumption it will be deployed as vercel.com lambda(edge functions) 
* stripe.com account - to handle credit card payments
* sendgrid.com account - to send booking confirmations emails
* infura.io account - to be able to offer cryptocurrency payments (optional)


### Database initialization
With the first setup, you need to have list of airports and cities loaded to your database.
Please refer to /tools/dictionary/initial folder


### Configuration
Application is configured with .env file located in root project folder
* rename .env.example file to .env
* edit contents and provide values for all keys that are in the file


### Application start
* npm install - to install all dependencies
* npm run nowdev - to start both frontend and backend

### Development
* npm run storybook - to start storybook (UI components development/testing) 

