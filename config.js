const GLIDER_BASEURL = "https://staging.aggregator.windingtree.net/api/v1"


const GLIDER_CONFIG =
    {
        GLIDER_TOKEN: "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6b3JnaWQ6MHgwOGZmZmMxNGRmOTNhMzA1ZjFiYmMyZWUyNjE3MTg4NWZlZTgwMTgxNDQ1ZDg5MjNhYjg0ODkyOTUzYzA5M2YyI3dlYnNlcnZlciIsImF1ZCI6ImRpZDpvcmdpZDoweDcxY2QxNzgxYTMwODJmMzNkMjUyMWFjODI5MGM5ZDRiM2IzYjExNmU0ZTg1NDhhNDkxNGI3MWExZjcyMDFkYTAiLCJpYXQiOjE1ODQ0MTc5MzcsImV4cCI6MTU5MjE5MzkzN30.D0vRZ4vFs4xXJXfTzE040lQeuLtPER2fgtaVsf1To69cRia1FdX5ZoBv8d6Nz31mkboJfq-akIcQDNcKau45gw",
        SEARCH_OFFERS_URL: GLIDER_BASEURL + "/offers/search",
        CREATE_WITH_OFFER_URL: GLIDER_BASEURL + "/orders/createWithOffer",
        SEATMAP_URL: GLIDER_BASEURL + "/offers/{offerId}/seatmap",
        REPRICE_OFFER_URL: GLIDER_BASEURL + "/offers/{offerId}/price",
        FULFILL_URL: GLIDER_BASEURL + "/orders/{orderId}/fulfill",
        ORGID:"0x71cd1781a3082f33d2521ac8290c9d4b3b3b116e4e8548a4914b71a1f7201da0"
    };

const ORGID = {
    OTA_ORGID:"0x08fffc14df93a305f1bbc2ee26171885fee80181445d8923ab84892953c093f2"
}

const SIMARD_BASEURL = "https://staging.api.simard.io/api/v1"

const SIMARD_CONFIG =
    {
        SIMARD_TOKEN: "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6b3JnaWQ6MHgwOGZmZmMxNGRmOTNhMzA1ZjFiYmMyZWUyNjE3MTg4NWZlZTgwMTgxNDQ1ZDg5MjNhYjg0ODkyOTUzYzA5M2YyI3dlYnNlcnZlciIsImF1ZCI6ImRpZDpvcmdpZDoweDVlNjk5NGY3Njc2NGNlYjQyYzQ3NmEyNTA1MDY1YTYxNzAxNzhhMjRjMDNkODFjOWYzNzI1NjM4MzAwMDExNzEiLCJpYXQiOjE1ODQ0MTc5MzcsImV4cCI6MTU5MjE5MzkzN30.mJutBPjYnEvUYtaKHny9Pw4f1oL-xYgMLH0rMNlrUySq4Z-V6zvNEmBx-bXRa77nNj0cePz9l5E9q3uIwT9Y7g",
        GUARANTEES_URL: SIMARD_BASEURL + "/balances/guarantees",
        CREATE_WITH_OFFER_URL: SIMARD_BASEURL + "/orders/createWithOffer",
        SIMULATE_DEPOSIT_URL: SIMARD_BASEURL + "/balances/simulateDeposit",
        ORGID:"0x5e6994f76764ceb42c476a2505065a6170178a24c03d81c9f372563830001171",
        DEPOSIT_EXPIRY_DAYS:14
    };


const REDIS_CONFIG =
    {
        REDIS_PORT: 14563,
        REDIS_HOST: process.env.REDIS_HOST,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD,
        SESSION_TTL_IN_SECS: 60 * 60
    };

const MONGO_CONFIG =
    {
        URL: process.env.MONGO_URL,
        DBNAME: process.env.MONGO_DBNAME,
    };

const STRIPE_CONFIG =
    {
        PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
        SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
        DISABLE_WEBHOOK_SIGNATURE_CHECK:true
    };
const ELASTIC_CONFIG =
    {
        URL: process.env.ELASTIC_URL
    };

module.exports = {
    GLIDER_CONFIG, SIMARD_CONFIG,
    REDIS_CONFIG, MONGO_CONFIG,
    STRIPE_CONFIG, ELASTIC_CONFIG
};