/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you require will output into a single css file (app.css in this case)
require('../css/app.css');

// Need jQuery? Install it with "yarn add jquery", then uncomment to require it.
let $ = require('jquery');

console.log('App - Start');

let promise = new Promise(function(resolve, reject) {
    let response = true;

    if (response) {
        resolve("Stuff worked!");
    } else {
        reject(Error("It broke"));
    }
});

promise.then(function(result) {
    console.log(result); // "Stuff worked!"
}, function(err) {
    console.log(err); // Error: "It broke"
});

console.log('Service Workers - Start');

$(document).ready(function () {
    console.log('App - Document is ready');

    if('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw-handler.js')
                .then(swReg => {
                    console.log('Service Worker is registered', swReg);
                })
                .catch(err => {
                    console.error('Service Worker Error', err);
                });
        });
    }
});
