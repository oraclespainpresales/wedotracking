var express = require('express');
var router = express.Router();
var axios = require("axios");
//var net = axios.create({ baseURL: "http://localhost:3000" });
var net = axios.create({ baseURL: "http://129.213.60.1:3100" });
var xmljs = require('xml-js');
var uniqid = require('uniqid');
var Promise = require("Promise");

exports.Utils = (function () {

    async function invokeBlockchain(method, args) {
      var ret = "{}";
      //console.log("queryBC="+method);
      try {
        var payload = {
          "channel": "wedobuyerorderer",
          "chaincode": "tracking",
          "chaincodeVer": "v4.09",
          "method": method,
          "args": args
        };
        //console.log("query.payload="+JSON.stringify(payload));
        var bcReturn = await net({
            method: "post",
            url: "/bcsgw/rest/v1/transaction/invocation",
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            data: payload
        });
        ret = bcReturn.data.info;
        console.log("invoke.result="+JSON.stringify(ret));
      } catch (err) {
        console.log("invoke.error="+err);
      }
      return JSON.parse(ret);
    }

    async function queryBlockchain(method, args) {
      var ret = "{}";
      //console.log("queryBC="+method);
      try {
        var payload = {
          "channel": "wedobuyerorderer",
          "chaincode": "tracking",
          "chaincodeVer": "v4.09",
          "method": method,
          "args": args
        };
        //console.log("query.payload="+JSON.stringify(payload));
        var bcReturn = await net({
            method: "post",
            url: "/bcsgw/rest/v1/transaction/query",
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            data: payload
        });
        ret = bcReturn.data.result.replace(/&quot;/g,'"');
        console.log("query.result="+JSON.stringify(ret));
      } catch (err) {
        console.log("query.error="+err);
      }
      return JSON.parse(ret);
    }


    async function invokeBlockchainRaw(method, args) {
      var ret = "{}";
      try {
        var payload = {
          "channel": "wedobuyerorderer",
          "chaincode": "tracking",
          "chaincodeVer": "v3.21",
          "method": method,
          "args": args
        };
        var bcReturn = await net({
            method: "post",
            url: "/bcsgw/rest/v1/transaction/invocation",
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            data: payload
        });
        ret = bcReturn.data;
      } catch (err) {
        console.log("query.error="+err);
      }
      return ret;
    }


    async function queryBlockchainRaw(method, args) {
      var ret = "{}";
      try {
        var payload = {
          "channel": "wedobuyerorderer",
          "chaincode": "tracking",
          "chaincodeVer": "v3.21",
          "method": method,
          "args": args
        };
        var bcReturn = await net({
            method: "post",
            url: "/bcsgw/rest/v1/transaction/query",
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            data: payload
        });
        ret = bcReturn.data;
      } catch (err) {
        console.log("query.error="+err);
      }
      return ret;
    }



    function replaceVariables(args) {
      for (var i=0; i<args.length; i++) {
        var arg = args[i];
        if( arg.indexOf("<<UUID>>")!=-1 ) {
          var id = getUUID();
          args[i] = args[i].replace(/<<UUID>>/g, id);
        }
        if( arg.indexOf("<<NOW>>")!=-1 ) {
          var ts = getNOW();
          args[i] = args[i].replace(/<<NOW>>/g, ts);
        }
      }
      return args;
    }

    function getUUID() {
      return uniqid.process().toUpperCase();
    }

    function getNOW() {
      return new Date().toISOString();
    }

    function escapeJSON(json) {
      return JSON.stringify(json).replace(/"/g, "'");
    }

    function unescapeJSON(json) {
      return JSON.stringify(json).replace(/'/g, '"');
    }

    return {
      invokeBlockchain: invokeBlockchain,
      queryBlockchain: queryBlockchain,
      invokeBlockchainRaw: invokeBlockchainRaw,
      queryBlockchainRaw: queryBlockchainRaw,
      replaceVariables: replaceVariables,
      escapeJSON: escapeJSON,
      unescapeJSON: unescapeJSON,
      getUUID: getUUID,
      getNOW: getNOW
    }
})();
