/**
 * Phase 1 Javascript
 * @TODO: if we want IE11 support, replace elementset.map functions
 */

/**
 * Util Elements
 */
var utilEle = {
   hasClass(elem, cls) {
      var str = " " + elem.className + " ";
      var testCls = " " + cls + " ";
      return(str.indexOf(testCls) != -1) ;
   },
   getClosestEleByClass(el, cls) {
      while (el && el !== document) {
      if (utilEle.hasClass(el, cls)) return el;
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

/**
 * Utility Funcs
 */
var utilFunc = {
   clickHelpers: {
      clickHelperEles: utilEle.byQueries('[data-click-helper]'),

      addEventListeners: function() {
         if(
            utilFunc.clickHelpers.clickHelperEles === null ||
            utilFunc.clickHelpers.clickHelperEles.length < 1
         ) return;
         [...this.clickHelperEles].map(function(ele) {
            ele.addEventListener('click', function() {
               var eleToClick = utilEle.byQuery(ele.dataset.clickHelper);
               eleToClick.click();
            });
         });
      }
   }
}

/**
 * Modals
 */
var modal = {
   modalTriggers: utilEle.byClass('modal-trigger'),
   openModal: function() { return utilEle.byQuery('[data-modal-active="true"]'); },
   open: function(modalName) {
      var modalEle = utilEle.byQuery('.modal[data-modal="' + modalName + '"]');
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
      [...this.modalTriggers].map(function(ele) {
         ele.addEventListener('click', function(event) {
            var current = event.currentTarget;
            modal.open(current.dataset.modal);
         });
      });
      // Document Click-off Close Modal
      document.addEventListener('click', function(e) {
         var closestModal = utilEle.getClosestEleByClass(e.target, 'modal__content');
         var closestTrigger = utilEle.getClosestEleByClass(e.target, 'modal-trigger');
         if(closestModal === null && closestTrigger === null) modal.close();
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
var survey = {
   pages: utilEle.byClass('survey'),
   navButtons: utilEle.byQueries('[data-survey-page]'),
   activePage: function() { return utilEle.byQuery('.survey.active')},
   errorBlock: utilEle.byClass('survey-errors')[0],

   validate: {
      isValid: false,
      errorMessage: 'Please Fill Out All Fields',
      validateForm: function(typesArr, cb) {
         if(typesArr && typesArr.length > 0) {
            for(var i = 0; i < typesArr.length; i += 1) {
               if(survey.validate[typesArr[i]]() === false) {
                  survey.validate.isValid = false;
                  if(typeof cb === 'function') return cb();
                  return;
               };
               if(i === typesArr.length - 1) {
                  survey.validate.isValid = true;
                  survey.errorBlock.classList.remove('active');
                  survey.validate.errorMessage = 'Please fill out all fields';
                  if(typeof cb === 'function') return cb();
                  return;
               }
            }
         }
         survey.validate.isValid = false;
         if(typeof cb === 'function') return cb();
         return;
      },
      showError: function() {
         survey.errorBlock.textContent = survey.validate.errorMessage;
         survey.errorBlock.classList.add('active');
      },
      radios: function() {
         var radioGroups = survey.activePage().querySelectorAll('.radio-group');
         var radios = survey.activePage().querySelectorAll('input[type="radio"]');
         if(
            radios === null ||
            radios.length < 1 ||
            radioGroups === null ||
            radioGroups.length < 1
         ) return true;

         var passedRadios = 0;
         for (var i = 0; i < radios.length; i += 1) {
            if(radios[i].checked) passedRadios += 1;
            if(passedRadios === radioGroups.length) return true;
         };

         survey.validate.errorMessage = 'Please select an answer for each scenario';
         return false;
      },
   },

   addEventListeners() {
      if(survey.navButtons === null || survey.navButtons.length < 1) return;
      [...survey.navButtons].map(function(ele) {
         ele.addEventListener('click', function(e) {
            e.preventDefault();
            var destinationPage = e.currentTarget.dataset.surveyPage;
            var destinationPageEle = utilEle.byQuery('[data-survey-step="' + destinationPage + '"]');
            if(destinationPageEle !== null && survey.activePage() !== null) {
               //@TODO: validation + validation conditional here
               survey.validate.validateForm(['radios'], function() {
                  if(survey.validate.isValid) {
                     survey.activePage().classList.remove('active');
                     destinationPageEle.classList.add('active');
                  } else {
                     survey.validate.showError();
                     ele.classList.add('error');
                     setTimeout(function() {
                        ele.classList.remove('error');
                     },305);
                  }
               })
            }
         });
      });
   }
}

/**
 * Add Event Listeners Function
 */
function addEventListeners() {
   utilFunc.clickHelpers.addEventListeners();
   modal.addEventListeners();
   survey.addEventListeners();
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
