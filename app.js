const { AuthAPIClient, DataAPIClient } = require("truelayer-client");
const app = require("express")();
const envalid = require("envalid");
var morgan = require('morgan')

require('dotenv').config();

// Get environment variables
const env = envalid.cleanEnv(process.env, {
    CLIENT_ID: envalid.str(),
    CLIENT_SECRET: envalid.str(),
    REDIRECT_URI: envalid.url()
});
// Create auth client instance - automatically picks up env vars
const authClient = new AuthAPIClient();

// Define array of permission scopes you give access to! UI window
const scopes = ["info", "accounts", "balance", "transactions", "offline_access", "cards"]

app.use(morgan('tiny'))

// Construct url and redirect to the auth dialog
app.get("/", (req, res) => {
    const authURL = authClient.getAuthUrl(env.REDIRECT_URI, scopes, "foobar", "", "", true);
    console.log('authURL', authURL);
    res.redirect(authURL);
});

// Get 'code' querystring parameter and hit data api
app.get("/truelayer-redirect", async (req, res) => {
    const code = req.query.code;
    try {
        const tokens = await authClient.exchangeCodeForToken(env.REDIRECT_URI, code);
        console.log({tokens});
        
        // Hit info endpoint for identity data
        const info = await DataAPIClient.getInfo(tokens.access_token);
        const allAccounts = await DataAPIClient.getAccounts(tokens.access_token);
        const cards = await DataAPIClient.getCards(tokens.access_token);
        const accountId = allAccounts.results[0].account_id;
    
        const account = await DataAPIClient.getAccount(tokens.access_token, accountId);
        const transactions = await DataAPIClient.getTransactions(tokens.access_token, accountId);
        const balance = await DataAPIClient.getBalance(tokens.access_token, accountId);


        // res.set("Content-Type", "text/plain");
        res.json({
            info,
            allAccounts,
            account,
            transactions,
            balance,
            cards
        });
    } catch (error) {
        console.log(error);
        
    }
});

app.listen(5000, () => console.log("Example app listening on port 5000..."));
