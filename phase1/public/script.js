/**
 * Util Functions
 */
var util = {
   // Element Utils
   ele: {
      hasClass(elem, cls) {
         var str = " " + elem.className + " ";
         var testCls = " " + cls + " ";
         return(str.indexOf(testCls) != -1) ;
      },
      getClosestEleByClass(el, cls) {
         while (el && el !== document) {
         if (util.ele.hasClass(el, cls)) return el;
            el = el.parentNode;
         }
         return null;
      },
      byClass: function(classStr) {
         return document.getElementsByClassName(classStr);
      },
      byQuery: function(queryStr) {
         return document.querySelector(queryStr);
      },
      byQueries: function(queryStr) {
         return document.querySelectorAll(queryStr);
      }
   }
}

/**
 * Modals
 */
var modal = {
   modalTriggers: util.ele.byClass('modal-trigger'),
   openModal: function() { return util.ele.byQuery('[data-modal-active="true"]'); },
   open: function(modalName) {
      var modalEle = util.ele.byQuery('.modal[data-modal="' + modalName + '"]');
      if(modalEle !== null) modalEle.dataset.modalActive = 'true';
   },
   close: function() {
      var openEle = this.openModal();
      if(openEle) {
         openEle.classList.add('fading');
         setTimeout(function() {
            openEle.dataset.modalActive = 'false';
            openEle.classList.remove('fading');
         }, 301);
      };
   },
   addEventListeners() {
      // Modal Triggers
      // RIP Compat
      [...this.modalTriggers].map(ele => {
         ele.addEventListener('click', function(event) {
            var current = event.currentTarget;
            modal.open(current.dataset.modal);
         });
      });
      // Document Click-off Close Modal
      document.addEventListener('click', function(e) {
         const closestModal = util.ele.getClosestEleByClass(e.target, 'modal__content');
         const closestTrigger = util.ele.getClosestEleByClass(e.target, 'modal-trigger');
         if(closestModal == null && closestTrigger == null) modal.close();
       });
      // Document ESC Key Close Modal
      document.addEventListener('keydown', function(event) {
         if(event.which === 27 || event.keyCode === 27) modal.close();
      });
   }
}

/**
 * Survey
 */

/**
 * Add Event Listeners
 */
function addEventListeners() {
   modal.addEventListeners();
}

/**
 * Call Page Code
 */
document.addEventListener('DOMContentLoaded', function() {
   addEventListeners();
   console.log('--------------------------');
   console.log('Welcome to Office Blankets');
   console.log('--------------------------');
});
