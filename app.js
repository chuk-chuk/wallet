const { AuthAPIClient, DataAPIClient } = require("truelayer-client");
const app = require("express")();
var cors = require('cors');
const envalid = require("envalid");
var morgan = require('morgan')

require('dotenv').config();

// Get environment variables
const env = envalid.cleanEnv(process.env, {
    CLIENT_ID: envalid.str(),
    CLIENT_SECRET: envalid.str(),
    REDIRECT_URI: envalid.url()
});

// Define array of permission scopes you give access to! UI window
const scopes = ["info", "accounts", "balance", "transactions", "offline_access", "cards"]

app.use(morgan('tiny'))
app.use(cors())

const getData = async (tokens) => {
    // Hit info endpoint for identity data
    const info = await DataAPIClient.getInfo(tokens.access_token);
    const allAccounts = await DataAPIClient.getAccounts(tokens.access_token);
    const cards = await DataAPIClient.getCards(tokens.access_token);
    const accountId = allAccounts.results[0].account_id;

    const account = await DataAPIClient.getAccount(tokens.access_token, accountId);
    const transactions = await DataAPIClient.getTransactions(tokens.access_token, accountId);
    const balance = await DataAPIClient.getBalance(tokens.access_token, accountId);


    // res.set("Content-Type", "text/plain");
    return {
        info,
        allAccounts,
        account,
        transactions,
        balance,
        cards
    };
}

// Create auth client instance - automatically picks up env vars
const authClient = new AuthAPIClient();

// Construct url and redirect to the auth dialog
app.get("/data", async (req, res) => {
    try {
        const code = req.query.code;
        const tokens = await authClient.exchangeCodeForToken(env.REDIRECT_URI, code);
        const data = await getData(tokens);
        res.json(data);
    } catch(err) {
        res.json(err);
    }
});

app.get("/auth", async (req, res) => {
    const authURL = authClient.getAuthUrl(env.REDIRECT_URI, scopes, "foobar", "", "", true);
    res.redirect(authURL);
});

// Get 'code' querystring parameter and hit data api
app.get("/truelayer-redirect", async (req, res) => {
    const code = req.query.code;
    res.redirect('http://localhost:3000/?code=' + code);
});

app.listen(5000, () => console.log("Example app listening on port 5000..."));
