const initsw = (debug)=>{
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('service-worker.js').then(function(reg) {
      reg.onupdatefound = function() {
        var installingWorker = reg.installing;

        if(debug){
          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) {
                  console.log('New or updated content is available.');
                } else {
                  console.log('Content is now available offline!');
                }
                break;

              case 'redundant':
                console.error('The installing service worker became redundant.');
                break;
            }
          };
        }
      };
    }).catch(function(e) {
      if(debug){
        console.error('Error during service worker registration:', e);
      }
    });
  }
};

export default initsw
