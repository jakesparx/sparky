import { hasConfig, getConfig } from "../api/lib/config";
import { getProcessEnvTz, getProcessEnvDstReferenceTimezone } from "../../lib";
import { base64ToString } from "../api/lib/utils";

const canGoogleImport = hasConfig("BASE64_GOOGLE_SECRET");

const googleClientEmail = () => {
  let output;
  if (canGoogleImport) {
    try {
      const s_GOOGLE_SECRET = base64ToString(process.env.BASE64_GOOGLE_SECRET);
      output = (JSON.parse((
        s_GOOGLE_SECRET
        .replace(/(\r\n|\n|\r)/gm, ""))) // new lines gum up parsing
        .client_email)
	      .replaceAll(" ", "");
    } catch (err) {
      console.error(`
        Google API failed to load client email.
        Please check your BASE64_GOOGLE_SECRET environment variable is intact: `,
        err);
    } 
  }
  return (output || "");
};

const rollbarScript = process.env.ROLLBAR_CLIENT_TOKEN
  ? `<script>
    var _rollbarConfig = {
        accessToken: "${process.env.ROLLBAR_CLIENT_TOKEN}",
        captureUncaught: false,
        enabled: ${process.env.NODE_ENV === "production"},
        payload: {
          environment: "${process.env.SOURCE_VERSION}",
          client: {
            javascript: {
              source_map_enabled: true,
              code_version: "{{{ git_sha }}}",
              guess_uncaught_frames: true
            }
          }
        }
    };
    // Rollbar Snippet
    !function(r){function e(t){if(o[t])return o[t].exports;var n=o[t]={exports:{},id:t,loaded:!1};return r[t].call(n.exports,n,n.exports,e),n.loaded=!0,n.exports}var o={};return e.m=r,e.c=o,e.p="",e(0)}([function(r,e,o){"use strict";var t=o(1).Rollbar,n=o(2);_rollbarConfig.rollbarJsUrl=_rollbarConfig.rollbarJsUrl||"https://d37gvrvc0wt4s1.cloudfront.net/js/v1.9/rollbar.min.js";var a=t.init(window,_rollbarConfig),i=n(a,_rollbarConfig);a.loadFull(window,document,!_rollbarConfig.async,_rollbarConfig,i)},function(r,e){"use strict";function o(r){return function(){try{return r.apply(this,arguments)}catch(e){try{console.error("[Rollbar]: Internal error",e)}catch(o){}}}}function t(r,e,o){window._rollbarWrappedError&&(o[4]||(o[4]=window._rollbarWrappedError),o[5]||(o[5]=window._rollbarWrappedError._rollbarContext),window._rollbarWrappedError=null),r.uncaughtError.apply(r,o),e&&e.apply(window,o)}function n(r){var e=function(){var e=Array.prototype.slice.call(arguments,0);t(r,r._rollbarOldOnError,e)};return e.belongsToShim=!0,e}function a(r){this.shimId=++c,this.notifier=null,this.parentShim=r,this._rollbarOldOnError=null}function i(r){var e=a;return o(function(){if(this.notifier)return this.notifier[r].apply(this.notifier,arguments);var o=this,t="scope"===r;t&&(o=new e(this));var n=Array.prototype.slice.call(arguments,0),a={shim:o,method:r,args:n,ts:new Date};return window._rollbarShimQueue.push(a),t?o:void 0})}function l(r,e){if(e.hasOwnProperty&&e.hasOwnProperty("addEventListener")){var o=e.addEventListener;e.addEventListener=function(e,t,n){o.call(this,e,r.wrap(t),n)};var t=e.removeEventListener;e.removeEventListener=function(r,e,o){t.call(this,r,e&&e._wrapped?e._wrapped:e,o)}}}var c=0;a.init=function(r,e){var t=e.globalAlias||"Rollbar";if("object"==typeof r[t])return r[t];r._rollbarShimQueue=[],r._rollbarWrappedError=null,e=e||{};var i=new a;return o(function(){if(i.configure(e),e.captureUncaught){i._rollbarOldOnError=r.onerror,r.onerror=n(i);var o,a,c="EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");for(o=0;o<c.length;++o)a=c[o],r[a]&&r[a].prototype&&l(i,r[a].prototype)}return e.captureUnhandledRejections&&(i._unhandledRejectionHandler=function(r){var e=r.reason,o=r.promise,t=r.detail;!e&&t&&(e=t.reason,o=t.promise),i.unhandledRejection(e,o)},r.addEventListener("unhandledrejection",i._unhandledRejectionHandler)),r[t]=i,i})()},a.prototype.loadFull=function(r,e,t,n,a){var i=function(){var e;if(void 0===r._rollbarPayloadQueue){var o,t,n,i;for(e=new Error("rollbar.js did not load");o=r._rollbarShimQueue.shift();)for(n=o.args,i=0;i<n.length;++i)if(t=n[i],"function"==typeof t){t(e);break}}"function"==typeof a&&a(e)},l=!1,c=e.createElement("script"),d=e.getElementsByTagName("script")[0],p=d.parentNode;c.crossOrigin="",c.src=n.rollbarJsUrl,c.async=!t,c.onload=c.onreadystatechange=o(function(){if(!(l||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState)){c.onload=c.onreadystatechange=null;try{p.removeChild(c)}catch(r){}l=!0,i()}}),p.insertBefore(c,d)},a.prototype.wrap=function(r,e){try{var o;if(o="function"==typeof e?e:function(){return e||{}},"function"!=typeof r)return r;if(r._isWrap)return r;if(!r._wrapped){r._wrapped=function(){try{return r.apply(this,arguments)}catch(e){throw e._rollbarContext=o()||{},e._rollbarContext._wrappedSource=r.toString(),window._rollbarWrappedError=e,e}},r._wrapped._isWrap=!0;for(var t in r)r.hasOwnProperty(t)&&(r._wrapped[t]=r[t])}return r._wrapped}catch(n){return r}};for(var d="log,debug,info,warn,warning,error,critical,global,configure,scope,uncaughtError,unhandledRejection".split(","),p=0;p<d.length;++p)a.prototype[d[p]]=i(d[p]);r.exports={Rollbar:a,_rollbarWindowOnError:t}},function(r,e){"use strict";r.exports=function(r,e){return function(o){if(!o&&!window._rollbarInitialized){var t=window.RollbarNotifier,n=e||{},a=n.globalAlias||"Rollbar",i=window.Rollbar.init(n,r);i._processShimQueue(window._rollbarShimQueue||[]),window[a]=i,window._rollbarInitialized=!0,t.processPayloads()}}}}]);
    // End Rollbar Snippet
  </script>`
  : "";

// the site is not very useful without auth0, unless you have a session cookie already
// good for doing dev offline
const externalLinks = process.env.NO_EXTERNAL_LINKS
  ? ""
  : '<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Poppins">';

export default function renderIndex(html, css, assetMap) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
    <title>SPARK</title>
    ${externalLinks}
    <style>
      /* CSS declarations go here */
      body {
        font-family: 'Poppins';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        padding: 0;
        margin: 0;
        height: 100%;
        font-size: 14px;
      }

      /**/
    </style>
    <style data-aphrodite>${css.content}</style>
    ${rollbarScript}
    <link rel="icon" href="https://jakesparx.github.io/spark-kit/spark-icon.svg">
  </head>
  <body>
    <div id="mount">${html}</div>
    <script>
      window.RENDERED_CLASS_NAMES=${JSON.stringify(css.renderedClassNames)}
      window.AUTH0_CLIENT_ID="${process.env.AUTH0_CLIENT_ID}"
      window.AUTH0_DOMAIN="${process.env.AUTH0_DOMAIN}"
      window.SUPPRESS_SELF_INVITE=${getConfig("SUPPRESS_SELF_INVITE", null, {
        truthy: true
      })}
      window.NODE_ENV="${process.env.NODE_ENV}"
      window.PRIVACY_URL="${process.env.PRIVACY_URL || ""}"
      window.BASE_URL="${process.env.BASE_URL || ""}"
      window.NOT_IN_USA=${process.env.NOT_IN_USA || 0}
      window.ALLOW_SEND_ALL=${getConfig("ALLOW_SEND_ALL", null, {
        truthy: 1
      }) || false}
      window.BULK_SEND_CHUNK_SIZE=${process.env.BULK_SEND_CHUNK_SIZE || 0}
      window.BULK_SEND_BATCH_SIZE=${process.env.BULK_SEND_BATCH_SIZE ||
        process.env.BULK_SEND_CHUNK_SIZE ||
        0}
      window.MAX_MESSAGE_LENGTH=${process.env.MAX_MESSAGE_LENGTH || 99999}
      window.TERMS_REQUIRE=${getConfig("TERMS_REQUIRE", null, {
        truthy: 1
      }) || false}
      window.TZ="${getProcessEnvTz() || ""}"
      window.CONTACT_LOADERS="${process.env.CONTACT_LOADERS ||
        "csv-upload,test-fakedata,datawarehouse"}"
      window.DST_REFERENCE_TIMEZONE="${getProcessEnvDstReferenceTimezone() ||
        "US/Eastern"}"
      window.PASSPORT_STRATEGY="${process.env.PASSPORT_STRATEGY || "auth0"}"
      window.PEOPLE_PAGE_CAMPAIGN_FILTER_SORT = "${process.env
        .PEOPLE_PAGE_CAMPAIGN_FILTER_SORT || ""}"
      window.PEOPLE_PAGE_ROW_SIZES="${process.env.PEOPLE_PAGE_ROW_SIZES || ""}"
      window.CONVERSATION_LIST_ROW_SIZES="${process.env
        .CONVERSATION_LIST_ROW_SIZES || ""}"
      window.CORE_BACKGROUND_COLOR="${process.env.CORE_BACKGROUND_COLOR || ""}"
      window.CAN_GOOGLE_IMPORT=${canGoogleImport}
      window.DOWNTIME="${process.env.DOWNTIME || ""}"
      window.DOWNTIME_TEXTER="${process.env.DOWNTIME_TEXTER || ""}"
      window.DOWNTIME_NO_INITIAL="${process.env.DOWNTIME_NO_INITIAL || ""}"
      window.EXPERIMENTAL_PER_CAMPAIGN_MESSAGING_LEGACY=${getConfig(
        "EXPERIMENTAL_PER_CAMPAIGN_MESSAGING_LEGACY",
        null,
        {
          truthy: 1
        }
      ) || false}
      window.EXPERIMENTAL_TWILIO_PER_CAMPAIGN_MESSAGING_SERVICE=${process.env
        .EXPERIMENTAL_TWILIO_PER_CAMPAIGN_MESSAGING_SERVICE || false}
      window.TWILIO_MULTI_ORG=${process.env.TWILIO_MULTI_ORG || false}
      ${
        process.env.TEXTER_SIDEBOXES
          ? 'window.TEXTER_SIDEBOXES="' + process.env.TEXTER_SIDEBOXES + '"'
          : ""
      }
      window.HOLD_ENTER_KEY=${getConfig("HOLD_ENTER_KEY", null, {
        truthy: 1
      }) || false}
      window.TEXTER_TWOCLICK=${getConfig("TEXTER_TWOCLICK", null, {
        truthy: 1
      }) || false}
      window.MAX_NUMBERS_PER_BUY_JOB=${getConfig("MAX_NUMBERS_PER_BUY_JOB") ||
        100};
      window.CONTACTS_PER_PHONE_NUMBER=${getConfig(
        "CONTACTS_PER_PHONE_NUMBER"
      ) || 200};
      window.HIDE_BRANCHED_SCRIPTS=${getConfig("HIDE_BRANCHED_SCRIPTS", null, {
        truthy: 1
      }) || false};
      window.MOBILIZE_EVENT_SHIFTER_URL='${getConfig(
        "MOBILIZE_EVENT_SHIFTER_URL"
      )}';
      window.ASSIGNMENT_CONTACTS_SIDEBAR=${getConfig(
        "ASSIGNMENT_CONTACTS_SIDEBAR"
      )};
      window.GOOGLE_CLIENT_EMAIL='${googleClientEmail()}';
      window.OPT_OUT_PER_STATE=${getConfig("OPT_OUT_PER_STATE", null, {
        truthy: true
      })}
    </script>
    <script src="${assetMap["bundle.js"]}"></script>
  </body>
</html>
`;
}
