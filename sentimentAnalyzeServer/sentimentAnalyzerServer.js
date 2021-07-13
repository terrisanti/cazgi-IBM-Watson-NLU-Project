const express = require('express');
const dotenv = require("dotenv");
const app = new express();
dotenv.config();

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2021-03-25',
    authenticator: new IamAuthenticator({
        apikey: api_key,
    }),
    serviceUrl: api_url,
    });

    return naturalLanguageUnderstanding;

    
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

/*app.get("/url/emotion", (req,res) => {

    return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
    return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => {
    return res.send("text sentiment for "+req.query.text);
});*/

app.get("/url/emotion", (req, res) => {
    const inputUrl = req.query.url;
    const urlAnalyzeParams = {
        url: inputUrl,
        language: 'en',
        features: {
            emotion: {},
        }
    };
    const urlEmotion = getNLUInstance()
        .analyze(urlAnalyzeParams)
        .then((analysisResults) => {
            let urlAnalysisResults = JSON.stringify(
                analysisResults.result.emotion.document.emotion,
                null,
                2
            );
            return res.send(urlAnalysisResults);
        })
        .catch((err) => {
            console.log("error:", err);
            return res.send(err);
        });
});

app.get("/url/sentiment", (req, res) => {
    const inputUrl = req.query.url;
    const urlAnalyzeParams = {
        url: inputUrl,
        language: 'en',
        features: {
            sentiment: {},
        }
    };

    const urlSentiment = getNLUInstance()
        .analyze(urlAnalyzeParams)
        .then((urlAnalysisResults) => {
            console.log(JSON.stringify(urlAnalysisResults, null, 2));
            res.send(urlAnalysisResults.result.sentiment.document.label);
        })
        .catch((err) => {
            console.log("error:", err);
            return res.send(err);
        });
});

app.get("/text/emotion", (req, res) => {
    const inputText = req.query.text;
    const textAnalyzeParams = {
        text: inputText,
        language: 'en',
        features: {
            emotion: {},
        }
    };
    const textEmotion = getNLUInstance()
        .analyze(textAnalyzeParams)
        .then((analysisResults) => {
            let textAnalysisResults = JSON.stringify(
                analysisResults.result.emotion.document.emotion,
                null,
                2
            );
            return res.send(textAnalysisResults);
        })
        .catch((err) => {
            console.log("error:", err);
            return res.send(err);
        });
});

app.get("/text/sentiment", (req, res) => {
    const inputText = req.query.text;
    const textAnalyzeParams = {
        text: inputText,
        language: 'en',
        features: {
            sentiment: {},
        }
    };
    const textSentiment = getNLUInstance()
        .analyze(textAnalyzeParams)
        .then((textAnalysisResults) => {
            return res.send(
                textAnalysisResults.result.sentiment.document.label
            );
        })
        .catch((err) => {
            console.log("error:", err);
            return res.send(err);
        });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

