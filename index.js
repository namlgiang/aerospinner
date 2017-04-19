var express = require('express');
var app = express();

// 'use strict';
//
// require('letsencrypt-express').create({
//
//   server: 'https://acme-v01.api.letsencrypt.org/directory'
//
// , email: 'namlgiangbiz@gmail.com'
//
// , agreeTos: true
//
// , approveDomains: [ 'fidgetcube.us' ]
//
// , app: app.use(express.static('public'))
//
// }).listen(80, 443);


var leStore = require('le-store-certbot').create({
  configDir: '/etc/letsencrypt',          // or /etc/letsencrypt or wherever
  privkeyPath: ':configDir/live/fidgetcube.us/privkey.pem',          //
  fullchainPath: ':configDir/live/fidgetcube.us/fullchain.pem',      // Note: both that :configDir and :hostname
  certPath: ':configDir/live/fidgetcube.us/cert.pem',                //       will be templated as expected by
  chainPath: ':configDir/live/fidgetcube.us/chain.pem',              //       node-letsencrypt
  workDir: '/etc/letsencrypt/var/lib',
  logsDir: '/etc/letsencrypt/var/log',
  webrootPath: '/etc/letsencrypt/srv/www/fidgetcube.us/.well-known/acme-challenge',
  debug: false
});


// returns an instance of node-letsencrypt with additional helper methods
var lex = require('letsencrypt-express').create({
  // set to https://acme-v01.api.letsencrypt.org/directory in production
  //server: 'staging',
  server: 'https://acme-v01.api.letsencrypt.org/directory',

  // If you wish to replace the default plugins, you may do so here
  //
  challenges: { 'http-01': require('le-challenge-fs').create({ webrootPath: '/etc/letsencrypt/var/acme-challenges' }) },
  store: leStore,


  // You probably wouldn't need to replace the default sni handler
  // See https://github.com/Daplie/le-sni-auto if you think you do
  //, sni: require('le-sni-auto').create({})

  approveDomains: approveDomains
});

function approveDomains(opts, certs, cb) {
  // TODO - verify domain

  if (certs) {
     opts.domains = certs.altnames;
   }
  else {
     opts.email = 'namlgiang@gmail.com';
     opts.agreeTos = true;
  }

  cb(null, { options: opts, certs: certs });
}

app.use(express.static('public'));

// handles acme-challenge and redirects to http
require('http').createServer(lex.middleware(require('redirect-https')())).listen(80, function () {
  console.log("Listening for ACME http-01 challenges on", this.address());
});

server = require('https').createServer(lex.httpsOptions, lex.middleware(app)).listen(443, function () {
  console.log("Listening for ACME tls-sni-01 challenges and serve app on", this.address());
});
