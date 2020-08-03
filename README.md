# Glider OTA
**Open source Online Travel Agency backed up by Winding Tree ecosystem** 




## Setting up local development environment
#### Prerequisites
Before you start, make sure you have the following prerequisites completed:    

* create an account in [Winding Tree marketplace](https://marketplace.windingtree.com/join) for your travel agency - this step is needed to get ORGiD of your organization
* you need an account on [vercel.com](https://vercel.com/) 
    * download and install [vercel CLI](https://vercel.com/download)
* have an instance of [Redis](https://redis.io/) - either local or cloud. It will be used as a temporary storage/cache.    
* have an instance of [Mongo](https://www.mongodb.com/) - either local or cloud. It will be used as a permanent storage.
* have an instance of [Elasticsearch](https://www.elastic.co/) - either local or cloud. It will be used to store logs and analyze app usage/troubleshoot.
* create an account in [Stripe](https://stripe.com/). Stripe is used as a payment gateway to allow acceptance of card payments.

#### Initial setup
In order to start your local environment, you will need to: 
* clone this repository to a local folder 
* initiate project and install all required packages

To achieve this, execute below commands   
```bash
git clone https://github.com/windingtree/glider-ota.git
cd glider-ota
npm install
```
Now you have to connect your local project with Vercel project. 
This will be needed only once and vercel CLI will walk you through the process. Just execute the following:
```bash
vercel
```
Congratulations. 
Now the last step is to provide some configuration details for your own setup (things like database access details, Redis, Elastisearch ...)
Skip now for details to the next [chapter](#configuration) which explains in details what you need and how configuration is done.
To provide all configuration details, you will need to add few 'secrets' and you can do this using the following Vercel CLI command:
```bash
vercel secrets add secret_name "secret_value"
```

After configuration is completed, you are ready to start your project in local environment with this Vercel CLI command: 
```bash
vercel dev
```
   
Above command starts backend services as well as React frontend.
Just open your browser and point to: http://localhost:3000 


   
#### Configuration
Most important configuration entries are provided as environment variables and are initiated by as stored in Vercel secrets.
Read more about:
* [environment variables](https://vercel.com/docs/v2/build-step?query=secrets#environment-variables)
* [secrets](https://vercel.com/docs/cli#commands/secrets)


You will need to define the below secrets in Vercel:
* {staging||production}.glider-ota.mongo.uri2 - Mongo instance URL
* {staging||production}.glider-ota.mongo.dbname - Mongo database name
* {staging||production}.glider-ota.redis.host - Redis hostname
* {staging||production}.glider-ota.redis.password - Redis password
* {staging||production}.glider-ota.stripe.publishable_key - Stripe publishable key
* {staging||production}.glider-ota.stripe.secret_key - Stripe secret key
* {staging||production}.glider-ota.stripe.webhook_secret - Stripe webhook secret key
* {staging||production}.glider-ota.elastic.url - Elasticsearch URL
* {staging||production}.glider-ota.glider_jwt - Glider JWT
* {staging||production}.glider-ota.simard_jwt - Simard JWT
* {staging||production}.glider-ota.glider-b2b_orgid - Your travel agency ORGiD [Winding Tree marketplace](https://marketplace.windingtree.com)

Depending on an environment, either 'staging' or 'production' variables will be used.
More details [here](./api/_lib/config.js)


## Documentation

Code is documented using JSDoc comments which allows automatic API docs creation.
Backend and frontend code is separated, thus API documentation can be generated separately for backend and frontend 

Use jsdoc to generate documentation.
 

#### Backend end API documentation
Execute the following command from the main project folder 
```bash
jsdoc -c jsdoc_frontend_conf.json
```
Documentation will be generated into `./docs/frontend` folder
#### Front end API documentation
Execute the following command from the main project folder 
```bash
jsdoc -c jsdoc_backend_conf.json
```

Documentation will be generated into `./docs/backend` folder


## Static/dictionary data
There are multiple types of external data sources needed by Glider OTA, for example:
* list of airports (e.g. to let users search the right departure&arrival airport using airport, city name)
* list of airlines (e.g. to display full airline name, not only 2-letter carrier code)
* list of cities

This data needs to be sourced and maintained.
Please refer to documentation  [here](./docs/data.md) for more information on this topic


## Development
### System architecture

##### Frontend
Frontend is a React web app.


##### Backend
Backend is developed as serverless nodejs functions and running on Vercel cloud hosting platform.
More info:
* [Vercel](https://vercel.com/) 
* [serverless functions](https://vercel.com/docs/v2/serverless-functions/introduction)


##### Integration
Glider OTA integrates with:
* Glider B2B to 
    * search for flight offers from airlines connected to Glider B2B
    * retrieve flight seatmaps
    * search for hotel offers from hotels connected to Glider B2B     
    * creating flight & hotel reservations 
* Simard 
    * which handles settlement between customers & suppliers (hotels, airlines)
* Stripe
    * for online payments processing 


#### Running application locally
In order to develop application locally, you need to run backend and frontend.
This is done with one command.
```bash
vercel dev
``` 

Changes in the code will be automatically hot deployed.

#### React components & testing
We use [storybook](https://storybook.js.org/) to document and test UI components.
To start storybook dashboard, simply run:
```bash
npm run storybook
```
and open http://localhost:9009/ to see all components used by Glider OTA


#### Unit Tests
Apart from storybook, there are multiple unit tests that can be executed by:


