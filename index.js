// a phantomjs example
var page = require('webpage').create();
phantom.outputEncoding="gbk";
page.open("http://www.xxx.cn/lecture/browe", function(status) {
    console.log(status);
    if ( status === "success" ) {
        console.log(page.title);
        console.log('page：；' + page);
        var content = page.evaluate(function (e) {
            console.log(e);
            var element = document.querySelector('#searchTitle');
            console.log(element);
            return element.textContent;
        });
        console.log(content);
    } else {
        console.log("Page failed to load.");
    }
    phantom.exit(0);
});
