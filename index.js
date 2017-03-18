'use strict';
const cheerioReq = require("cheerio-req");
var Alexa = require('alexa-sdk');

var APP_ID = undefined;
var SKILL_NAME = 'Urban Dictionary Word of the Day';

var word = "";
var meaning = "";
var example = "";


scrapeUD();


if(word == "" || meaning == "" || example == "") {
  scrapeUD();
}


exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};


var handlers = {
    'LaunchRequest': function () {
        this.emit('GetWOTD');
    },
    'GetNewWOTDIntent': function () {
        this.emit('GetWOTD');
    },
    'GetWOTD': function () {

      if(word == "" || meaning == "" || example == "") {
        speechOutput = "Sorry, something went wrong, please try again.";
      }
      else {
        var speechOutput = "The word of the day is " + word + "." +
        meaning + "... " +
        " You could use " + word + " in a sentence by saying " + example;
      }

        this.emit(':tell', speechOutput, SKILL_NAME)
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can ask me what the Urban Dictionary word of the day is";
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    }
};

function scrapeUD() {
  cheerioReq("http://www.urbandictionary.com/", (err, $) => {
      word = ($(".word").first().text());
      meaning = ($(".meaning").first().text());
      example = ($(".example").first().text());
      // => Word of the day
  });
}
