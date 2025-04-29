function log(toLog) {
  document.querySelector('#log').innerHTML += toLog + '\n';
}

function isPopupBridge() {
  return Boolean(window.popupBridge && window.popupBridge.open);
}

function click() {
  var url;
  var resultTerm = document.getElementById('resultTerm');
  var resultData = document.getElementById('resultData');

  console.log('click!');

  if (isPopupBridge()) {
    alert("popup bridge available");
    
    var href = window.location.href;
    url = href.substring(0, href.lastIndexOf("/")) + '/this_launches_in_popup.html' +
      '?popupBridgeReturnUrlPrefix=' + window.popupBridge.getReturnUrlPrefix();

    window.popupBridge.open(url);

  } else {
    alert("popup bridge not available");
    var popup = window.open("this_launches_in_popup.html", "DescriptiveWindowName", "resizable,scrollbars,status,height=400px,width=400px");

    window.addEventListener('message', function (event) {
      var color = JSON.parse(event.data).color;

      popup.close();
      if (color) {
        resultTerm.innerHTML = 'Your favorite color:';
        resultData.innerHTML = color;
      } else {
        resultTerm.innerHTML = 'You did not like any of our colors';
        resultData.innerHTML = '';
      }
    });
  }
}

var button = document.getElementsByTagName('button')[0];
button.addEventListener('click', click);

if (isPopupBridge()) {
  var resultTerm = document.getElementById('resultTerm');
  var resultData = document.getElementById('resultData');

  window.popupBridge.onCancel = function () {
    resultTerm.innerHTML = 'You did not choose a color';
    resultData.innerHTML = '';
  };

  window.popupBridge.onComplete = function (err, payload) {
    if (err) {
      resultTerm.innerHTML = 'Error:'
      resultData.innerHTML = JSON.stringify(err);
    } else if (payload) {
      if (payload.path === '/cancel') {
        resultTerm.innerHTML = 'You did not like any of our colors';
        resultData.innerHTML = '';
      } else if (payload.queryItems) {
        resultTerm.innerHTML = 'Your favorite color:';
        resultData.innerHTML = payload.queryItems.color;
      }
    } else {
      resultTerm.innerHTML = 'You did not choose a color';
      resultData.innerHTML = '';
    }
  };
}
