⚠️ bk-generator is deprecated and no more maintained. Please refer to Scotow/burgoking ⚠️

# bk-generator
🍔 **Burger King - Free Burger Code Generator** 🍔

Generate a Burger King's promotion code to get a free burger using CasperJS.

### Prerequisites

This module was developed using the following version and was not tested with previous ones (even if it may work with previous releases):

* [Node.js](http://nodejs.org) >= 8.X
* [PhantomJS](http://phantomjs.org/) >= 2.1.X
* [CasperJS](http://casperjs.org/) >= 1.1.X (installed as global)

### How to install

#### As a project module

`npm install -S bk-generator`

#### As a global package

`npm install -g bk-generator`

Modify (if needed) your casperjs path in 'lib/generator.js' to be able to use this package.

### Example

#### Using the library

*bk-generator* use [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to generate code. Here is an example that print a code in the console if everything went smoothly:

```js
const bkGenerator = require('bk-generator');

bkGenerator.generateCode()
.then((code) => {
    console.log(code);      // A code was successfully generated.
})
.catch((errorCode) => {
    console.log(errorCode);     // An error has occurred, the error code of the casperjs command (or bash/sh) is return.
});
```

*NB: An error code of 127 is usually return when bash/sh doesn't find the casperjs command.*

#### Using the built-in commands

`bk-code`
> Generator a promotion code and print it in the console.

`bk-web-server`
> Start a web server wrapper using **expressJS** and **socket.io**, on port 4002 or on the PORT env variable if defined.

### Contribution

Feedback are appreciated. Feel free to open an issue or a pull request if needed.

Furthermore, if you went to restaurant which its number isn't in the restaurants [list](https://github.com/Scotow/bk-generator/blob/master/casper-generator.js#L5), a merge request to add it is appreciated.

### Disclaimer

*bk-generator* provided by *Scotow* is for illustrative purposes only which provides customers with programming information regarding the products. This software is supplied "AS IS" without any warranties and support.

I assumes no responsibility or liability for the use of the software, conveys no license or title under any patent, copyright, or mask work right to the product.

### Golang version

A newer version of this project made with Golang is availiable [here](https://github.com/Scotow/burgoking).

***Enjoy your meal!***
