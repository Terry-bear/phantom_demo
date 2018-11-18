var phantom = require('phantom')

var count = 0

function downloadPageToPdf(num) {
  var sitepage = `http://www.xxx.cn/${process.argv[2]}/detail/${num}`
  var phInstance = null
  var title = null
  phantom
    .create()
    .then(instance => {
      phInstance = instance
      return instance.createPage()
    })
    .then(page => {
      // use page
      page.property("viewportSize", {
        width: 1024,
        height: 768
      })
      page.open(sitepage).then(function() {
        page
          .evaluate(function() {
            var headerDom = document.getElementsByClassName("header")[0];
            headerDom.parentNode.removeChild(headerDom);
            var footerDom = document.getElementsByClassName("footer")[0];
            footerDom.parentNode.removeChild(footerDom);
            var aDom = document.getElementsByClassName("top")[0];
            aDom.parentNode.removeChild(aDom);
            var div = document.getElementsByClassName(
              'information-details-pannel'
            )[0] //要截图的div的id
            var bc = div.getBoundingClientRect()
            var top = bc.top
            var left = bc.left
            var width = bc.width
            var height = bc.height / 6
            return {
              size: [top, left, width, height],
              title: document.title
            }
          })
          .then(function(dataInfo) {
            console.log('dataInfo: ', dataInfo)
            title = dataInfo.title
            page.property('clipRect', {
              top: dataInfo.size[0],
              left: dataInfo.size[1],
              width: dataInfo.size[2],
              height: dataInfo.size[3]
            })
            page.property('paperSize', {
                top: dataInfo.size[0],
                left: dataInfo.size[1],
                width: dataInfo.size[2],
                height: dataInfo.size[3]
              })
              .then(function() {
                page.render(`./pdf/${process.argv[2]}/${title}.pdf`).then(function() {
                  count++
                  console.log(process.argv[2] + '---->' + count + '---Page rendered')
                  phInstance.exit()
                })
              })
          })
      })
    })
    .catch(error => {
      console.log('create page error : ', error)
      phInstance.exit()
    })
}

for (let i = 1; i <= process.argv[3]; i++) {
  setTimeout(() => {
    console.log(process.argv[2] + ' begin download, count: ', i)
    downloadPageToPdf(i)
  }, 8000 * i)
}
