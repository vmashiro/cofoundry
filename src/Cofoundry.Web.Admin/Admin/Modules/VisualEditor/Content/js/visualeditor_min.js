/*! UberCMS 2017-06-01 */
angular.module("cms.visualEditor",["cms.shared"]).constant("_",window._).constant("visualEditor.modulePath","/Admin/Modules/VisualEditor/Js/"),angular.module("cms.visualEditor").factory("visualEditor.pageModuleService",["$http","shared.serviceBase","visualEditor.options",function(a,b,c){function d(a,b){return e(a)+"/"+b}function e(a){return a?h:g}var f={},g=b+"page-version-section-modules",h=b+"custom-entity-version-page-modules";return f.getAllModuleTypes=function(){return a.get(b+"page-module-types/")},f.getPageVersionModuleById=function(b,c){return a.get(d(b,c)+"?datatype=updatecommand")},f.getSection=function(c){return a.get(b+"page-templates/0/sections/"+c)},f.getModuleTypeSchema=function(c){return a.get(b+"page-module-types/"+c)},f.add=function(b,d){var f=b?"customEntity":"page";return d[f+"VersionId"]=c.versionId,a.post(e(b),d)},f.update=function(b,c,e){return a.put(d(b,c),e)},f.remove=function(b,c){return a["delete"](d(b,c))},f.moveUp=function(b,c){return a.put(d(b,c)+"/move-up")},f.moveDown=function(b,c){return a.put(d(b,c)+"/move-down")},f}]),angular.module("cms.visualEditor").directive("cmsPageSection",["$window","$timeout","_","shared.modalDialogService","visualEditor.modulePath",function(a,b,c,d,e){function f(a){this.getSectionParams=function(){return c.pick(a,["siteFrameEl","refreshContent","pageTemplateSectionId","isMultiModule","isCustomEntity","permittedModuleTypes"])}}function g(c,f,g){function h(){c.isOver=!1,c.setIsOver=j,c.addModule=i,c.startScrollY=0,c.currentScrollY=0,c.$watch("sectionAnchorElement",k),c.$watch("isSectionOver",j),c.$watch("scrolled",m),c.$watch("resized",l)}function i(){function a(){c.isPopupActive=!1}c.isPopupActive=!0,d.show({templateUrl:e+"Routes/Modals/AddModule.html",controller:"AddModuleController",options:{anchorElement:c.sectionAnchorElement,pageTemplateSectionId:c.pageTemplateSectionId,onClose:a,refreshContent:n,isCustomEntity:c.isCustomEntity,permittedModuleTypes:c.permittedModuleTypes}})}function j(a){a?(p&&(b.cancel(p),p=null),c.isOver=!0,o(c.sectionAnchorElement,!0)):p||(p=b(function(){c.isOver=!1,o(c.sectionAnchorElement,!1)},300))}function k(b,d){function e(a){return a?a.split(","):[]}function f(){var d=c.siteFrameEl,e=b.offset(),f=d.offset(),g=d[0].contentDocument.documentElement,h=e.top+f.top-g.scrollTop+2;h<f.top&&(h=f.top);var i=(a.innerWidth-d[0].clientWidth)/2+(e.left+b[0].offsetWidth);c.css={top:h+"px",left:(i||0)+"px"},c.startScrollY=c.currentScrollY,c.startY=h}b&&(c.pageTemplateSectionId=b.attr("data-cms-page-template-section-id"),c.sectionName=b.attr("data-cms-page-section-name"),c.isMultiModule=b.attr("data-cms-multi-module"),c.permittedModuleTypes=e(b.attr("data-cms-page-section-permitted-module-types")),c.isCustomEntity=b[0].hasAttribute("data-cms-custom-entity-section"),f()),o(d,!1)}function l(a){c.isOver=!1,c.sectionAnchorElement=""}function m(a){c.currentScrollY=a||0;var b=c.startY+(c.startScrollY-a);0>b&&(b=0),b&&(c.css={top:b+"px",left:c.css.left})}function n(){return c.refreshContent({pageTemplateSectionId:c.pageTemplateSectionId})}function o(a,b){a&&a.toggleClass("cofoundry-sv__hover-section",b)}var p;h()}return{restrict:"E",templateUrl:e+"UIComponents/PageSection.html",controller:["$scope",f],link:g,replace:!0}}]),angular.module("cms.visualEditor").directive("cmsPageSectionModule",["$window","$timeout","visualEditor.pageModuleService","shared.modalDialogService","shared.LoadState","visualEditor.modulePath","visualEditor.options",function(a,b,c,d,e,f,g){function h(g,h,i,j){function k(){g.isOver=!1,u(),g.setIsOver=p,g.addModule=n.bind(null,"Last"),g.editModule=o,g.moveModuleUp=l.bind(null,!0),g.moveModuleDown=l.bind(null,!1),g.addModuleAbove=n.bind(null,"BeforeItem"),g.addModuleBelow=n.bind(null,"AfterItem"),g.deleteModule=m,g.globalLoadState=x,g.$watch("anchorElement",q),g.$watch("isContainerOver",p),g.$watch("scrolled",r)}function l(a){var b=a?c.moveUp:c.moveDown;x.isLoading||(x.on(),b(w.isCustomEntity,g.versionModuleId).then(s)["finally"](x.off))}function m(){function a(){return c.remove(b,g.versionModuleId).then(s)["finally"](x.off)}var b=(g.anchorElement,w.isCustomEntity),e={title:"Delete Module",message:"Are you sure you want to delete this module?",okButtonTitle:"Yes, delete it",onOk:a};x.isLoading||(x.on(),d.confirm(e))}function n(a){function b(){g.isPopupActive=!1,x.off()}x.isLoading||(x.on(),g.isPopupActive=!0,d.show({templateUrl:f+"Routes/Modals/AddModule.html",controller:"AddModuleController",options:{anchorElement:g.anchorElement,pageTemplateSectionId:g.pageTemplateSectionId,adjacentVersionModuleId:g.versionModuleId,insertMode:a,refreshContent:s,isCustomEntity:w.isCustomEntity,permittedModuleTypes:w.permittedModuleTypes,onClose:b}}))}function o(){function a(){g.isPopupActive=!1,x.off()}x.isLoading||(x.on(),g.isPopupActive=!0,d.show({templateUrl:f+"Routes/Modals/EditModule.html",controller:"EditModuleController",options:{anchorElement:g.anchorElement,versionModuleId:g.versionModuleId,pageModuleTypeId:g.pageModuleTypeId,isCustomEntity:w.isCustomEntity,refreshContent:s,onClose:a}}))}function p(a){u(),a?(v&&(b.cancel(v),v=null),g.isOver=!0,t(g.anchorElement,!0)):v||(v=b(function(){g.isOver=!1,t(g.anchorElement,!1)},300))}function q(c,d){function e(c,d){var e=w.siteFrameEl,f=c.offset(),g=e.offset(),h=e[0].contentDocument.documentElement,i=f.top+g.top-h.scrollTop+2;i<g.top&&(i=g.top);var j=f.left-h.scrollLeft+(a.innerWidth-e[0].clientWidth)/2+2;d.css={top:i+"px",left:(j||0)+"px"},d.startScroll=e[0].contentWindow.scrollY,d.startY=i,b(function(){var a,a,b=document.getElementById("cofoundry-sv__module-popover");b&&(a=b.offsetHeight,windowHeight=window.innerHeight,b.offsetTop+a>windowHeight&&(d.css.top=windowHeight-a+"px"))},1)}c&&(g.versionModuleId=c.attr("data-cms-version-module-id"),g.pageModuleTypeId=c.attr("data-cms-page-module-type-id"),e(c,g)),t(d,!1)}function r(a){var b=g.startY-a+g.startScroll;b&&(g.css={top:b+"px",left:g.css.left})}function s(){return g.refreshContent({pageTemplateSectionId:g.pageTemplateSectionId})}function t(a,b){a&&a.toggleClass("cofoundry-sv__hover-module",b)}function u(){w=j[0].getSectionParams(),g.isMultiModule=w.isMultiModule,g.pageTemplateSectionId=w.pageTemplateSectionId}var v,w,x=new e;k()}return{scope:{anchorElement:"=",isContainerOver:"=",refreshContent:"=",scrolled:"="},templateUrl:f+"UIComponents/PageSectionModule.html",require:["^cmsPageSection"],link:h}}]),angular.module("cms.visualEditor").directive("cmsSitePageFrame",["$window","$templateCache","$compile","$document","$q","$http","visualEditor.options",function(a,b,c,d,e,f,g){function h(a,b){function c(){a.$apply(function(){var c=b[0].contentWindow,d=b[0].contentDocument;i(a,d,b),c.addEventListener("scroll",function(b){a.scrolled=angular.element(this)[0].scrollY,a.$apply()}),c.addEventListener("resize",function(b){a.resized=angular.element(this)[0].innerWidth}),l&&l.resolve()})}b.ready(c)}function i(a,b,c){var d=new k(a,c);j(b,d),angular.element(b).find("html").addClass(g.isCustomEntityRoute?"cofoundry-editmode__custom-entity":"cofoundry-editmode__page")}function j(a,b){function c(b,c,e){var f,g,h,i="data-cms-"+d+"-"+b;for(f=a.hasAttribute&&a.hasAttribute(i)?[a]:a.querySelectorAll("["+i+"]"),g=f.length,h=0;g>h;++h)f[h].addEventListener("mouseenter",c.bind(null,angular.element(f[h]))),f[h].addEventListener("mouseleave",e)}var d=g.isCustomEntityRoute?"custom-entity":"page";c("section",b.showSection,b.hideSection),c("section-module",b.showModule,b.hideModule)}function k(a,b){function g(b){return function(c){a.$apply(b.bind(null,c))}}function h(a){return a.pageTemplateSectionId?k('[data-cms-page-template-section-id="'+a.pageTemplateSectionId+'"]'):a.versionModuleId?k('[data-cms-version-module-id="'+a.versionModuleId+'"]'):m()}function i(){return f.get(b[0].contentWindow.location.href)}function k(a){var c=b[0].contentDocument.querySelector(a),d=c.cloneNode(!0),e=d.querySelector(".cofoundry-sv__hover-module");return d.className+=" cofoundry-sv__section-loading",e&&(e.className=e.className.replace("cofoundry-sv__hover-module","")),c.parentNode.replaceChild(d,c),i().then(function(c){var e=n(c.data);r.isModuleOver=!1,r.isSectionOver=!1;var f=e.querySelector(a);f&&(d.parentNode.replaceChild(f,d),j(f,q)),o(b,"pageContentReloaded",{})})}function m(){return b[0].contentWindow.location.reload(),l=e.defer(),l.promise}function n(a){var b=document.createElement("div");return b.innerHTML=a,b}function o(a,b,c){var d=a[0].contentWindow;d.CMS&&d.CMS.events.trigger(b,c)}var p,q=this,r=a.$new(),s=c("<cms-page-section></cms-page-section>");r.siteFrameEl=b,r.refreshContent=h,p=s(r),d.find("body").eq(0).append(p),q.showSection=g(function(a){r.isSectionOver&&a==r.sectionAnchorElement||(r.isSectionOver=!0,r.sectionAnchorElement=a)}),q.hideSection=g(function(){r.isSectionOver=!1}),q.showModule=g(function(a){r.isModuleOver&&a==r.moduleAnchorElement||(r.isModuleOver=!0,r.moduleAnchorElement=a)}),q.hideModule=g(function(){r.isModuleOver=!1})}return{restrict:"A",link:h};var l}]),angular.module("cms.visualEditor").controller("VisualEditorController",["$window","$scope","_","shared.LoadState","shared.entityVersionModalDialogService","shared.modalDialogService","shared.localStorage","visualEditor.pageModuleService","visualEditor.modulePath","shared.urlLibrary","visualEditor.options",function(a,b,c,d,e,f,g,h,i,j,k){function l(){var b=a.addEventListener?"addEventListener":"attachEvent",c=window[b],d="attachEvent"===b?"onmessage":"message";c(d,m),C.globalLoadState=D,C.config=n,C.publish=o,C.unpublish=p,C.copyToDraft=q,C.addSectionModule=r,C.addModule=s,C.addModuleAbove=s,C.addModuleBelow=s,C.editModule=t,C.moveModuleUp=u,C.moveModuleDown=u,C.deleteModule=v}function m(a){C[a.data.action].apply(this,a.data.args)}function n(){B={entityNameSingular:k.entityNameSingular,isCustomEntity:k.isCustomEntityRoute}}function o(a){e.publish(a.entityId,z,B).then(x)["catch"](A)}function p(a){e.unpublish(a.entityId,z,B).then(y)["catch"](A)}function q(a){e.copyToDraft(a.entityId,a.versionId,a.hasDraftVersion,z,B).then(y)["catch"](A)}function r(a){function b(){D.off()}f.show({templateUrl:i+"Routes/Modals/AddModule.html",controller:"AddModuleController",options:{insertMode:a.insertMode,pageTemplateSectionId:a.pageTemplateSectionId,adjacentVersionModuleId:a.versionModuleId,permittedModuleTypes:a.permittedModuleTypes,onClose:b,refreshContent:w,isCustomEntity:a.isCustomEntity}})}function s(a){function b(){D.off()}D.isLoading||(D.on(),f.show({templateUrl:i+"Routes/Modals/AddModule.html",controller:"AddModuleController",options:{pageTemplateSectionId:a.pageTemplateSectionId,adjacentVersionModuleId:a.versionModuleId,permittedModuleTypes:a.permittedModuleTypes,insertMode:a.insertMode,refreshContent:w,isCustomEntity:a.isCustomEntity,onClose:b}}))}function t(a){function b(){D.off()}D.isLoading||(D.on(),f.show({templateUrl:i+"Routes/Modals/EditModule.html",controller:"EditModuleController",options:{versionModuleId:a.versionModuleId,pageModuleTypeId:a.pageModuleTypeId,isCustomEntity:a.isCustomEntity,refreshContent:w,onClose:b}}))}function u(a){var b=a.isUp?h.moveUp:h.moveDown;D.isLoading||(D.on(),b(a.isCustomEntity,a.versionModuleId).then(w)["finally"](D.off))}function v(a){function b(){return h.remove(d,a.versionModuleId).then(w)["finally"](D.off)}function c(){D.off()}var d=a.isCustomEntity,e={title:"Delete Module",message:"Are you sure you want to delete this module?",okButtonTitle:"Yes, delete it",onOk:b,onCancel:c};D.isLoading||(D.on(),f.confirm(e))}function w(){y()}function x(){var b=a.parent.location.href;b.indexOf("mode=edit")>-1&&(b=b.replace("mode=edit","mode=preview")),a.parent.location=b}function y(){a.parent.location=a.parent.location}function z(a){C.globalLoadState.on()}function A(a){C.globalLoadState.off()}var B,C=this,D=(a.document,new d);l()}]);