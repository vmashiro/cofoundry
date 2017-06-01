/*! UberCMS 2017-06-01 */
angular.module("cms.pages",["ngRoute","cms.shared"]).constant("_",window._).constant("pages.modulePath","/Admin/Modules/Pages/Js/"),angular.module("cms.pages").config(["$routeProvider","shared.routingUtilities","pages.modulePath",function(a,b,c){var d=b.mapOptions.bind(null,c);a.when("/directories",d("WebDirectoryList")).when("/directories/new",d("AddWebDirectory")).when("/directories/:id",d("WebDirectoryDetails")).when("/new",d("AddPage")).when("/:id",d("PageDetails")).otherwise(d("PageList"))}]),angular.module("cms.pages").factory("pages.customEntityService",["$http","shared.serviceBase",function(a,b){var c={};return c.getAllRoutingRules=function(){return a.get(b+"custom-entity-routing-rules/")},c}]),angular.module("cms.pages").factory("pages.directoryService",["$http","_","shared.serviceBase",function(a,b,c){var d={},e=c+"webdirectories";return d.getAll=function(){return a.get(e)},d}]),angular.module("cms.pages").factory("pages.pageTemplateService",["$http","$q","shared.serviceBase",function(a,b,c){var d={},e=c+"page-templates";return d.getAll=function(){var c=b.defer();return a.get(e).then(function(a){c.resolve(a.items)},c.reject),c.promise},d}]),angular.module("cms.pages").controller("AddPageController",["_","$q","$location","$window","shared.LoadState","shared.stringUtilities","shared.urlLibrary","shared.pageService","pages.pageTemplateService","pages.customEntityService",function(a,b,c,d,e,f,g,h,i,j){function k(){u.save=l.bind(null,!1,m),u.saveAndPublish=l.bind(null,!0,m),u.saveAndEdit=l.bind(null,!1,n),u.cancel=q,u.onNameChanged=o,u.onPageTypeChanged=p,u.globalLoadState=new e,u.saveLoadState=new e,u.saveAndPublishLoadState=new e,u.formLoadState=new e(!0),u.onLocalesLoaded=v.resolve,u.onWebDirectoriesLoaded=w.resolve,r()}function l(a,b){var c;a?(u.command.publish=!0,c=u.saveAndPublishLoadState):c=u.saveLoadState,s(c),h.add(u.command).then(b)["finally"](t.bind(null,c))}function m(a){c.path("/"+a)}function n(a){function b(a){d.location.href=g.pageVisualEditor(a.pageRoute,!0)}return h.getById(a).then(b)}function o(){u.command.urlPath=f.slugify(u.command.title)}function p(){var b=u.command.pageType,c="CustomEntityDetails"==b?b:"Generic";u.pageTemplates=a.where(u.allPageTemplates,{pageType:c})}function q(){c.path("/")}function r(){u.pageTypes=h.getPageTypes(),u.command={showInSiteMap:!0,pageType:u.pageTypes[0].value};var a=i.getAll().then(function(a){u.allPageTemplates=a}),b=j.getAllRoutingRules().then(function(a){u.routingRules=a});u.formLoadState.offWhen(v,w,a,b).then(p)}function s(b){u.globalLoadState.on(),b&&a.isFunction(b.on)&&b.on()}function t(b){u.globalLoadState.off(),b&&a.isFunction(b.off)&&b.off()}var u=this,v=b.defer(),w=b.defer();k()}]),angular.module("cms.pages").controller("PageDetailsController",["$routeParams","$q","$location","_","shared.LoadState","shared.modalDialogService","shared.entityVersionModalDialogService","shared.urlLibrary","shared.pageService","pages.modulePath",function(a,b,c,d,e,f,g,h,i,j){function k(){E.edit=m,E.save=n.bind(null,!1),E.saveAndPublish=n.bind(null,!0),E.cancel=o,E.publish=p,E.unpublish=q,E.discardDraft=r,E.copyToDraft=s,E.deletePage=t,E.duplicatePage=u,E.changeUrl=v,E.getPartialUrl=l,E.editMode=!1,E.globalLoadState=new e,E.saveLoadState=new e,E.saveAndPublishLoadState=new e,E.formLoadState=new e(!0),E.urlLibrary=h,y(E.formLoadState)}function l(a){return j+"Routes/Partials/"+a+".html"}function m(){E.editMode=!0,E.mainForm.formStatus.clear()}function n(a){var b;a?(E.updateDraftCommand.publish=!0,b=E.saveAndPublishLoadState):b=E.saveLoadState,C(b),i.update(E.updatePageCommand).then(i.updateDraft.bind(this,E.updateDraftCommand)).then(w.bind(null,"Changes were saved successfully"))["finally"](D.bind(null,b))}function o(){E.editMode=!1,E.updatePageCommand=z(E.page),E.updateDraftCommand=A(E.page),E.mainForm.formStatus.clear()}function p(){g.publish(E.page.pageId,C).then(w.bind(null,"Page published successfully."))["catch"](D)}function q(){g.unpublish(E.page.pageId,C).then(w.bind(null,"The page has been unpublished and reverted to draft state."))["catch"](D)}function r(){function a(){return C(),i.removeDraft(E.page.pageId)}var b={title:"Discard Version",message:"Are you sure you want to discard this draft? This will discard all changes since the page was last published.",okButtonTitle:"Yes, discard it",onOk:a};f.confirm(b).then(w.bind(null,"Draft discarded successfully"))}function s(a){function b(){w("Draft created successfully.")}var c=!!x();g.copyToDraft(E.page.pageId,a.pageVersionId,c,C).then(b)["catch"](D)}function t(){function a(){return C(),i.remove(E.page.pageId).then(B)["catch"](D)}var b={title:"Delete Page",message:"Are you sure you want to delete this page?",okButtonTitle:"Yes, delete it",onOk:a};f.confirm(b)}function u(){f.show({templateUrl:j+"Routes/Modals/DuplicatePage.html",controller:"DuplicatePageController",options:{page:E.page}})}function v(){f.show({templateUrl:j+"routes/modals/changepageurl.html",controller:"ChangePageUrlController",options:{page:E.page,onSave:w.bind(null,"Url Changed")}})}function w(a,b){return y(b).then(E.mainForm.formStatus.success.bind(null,a))}function x(){return d.find(E.versions,function(a){return"Draft"===a.workFlowStatus})}function y(c){function d(){return i.getById(a.id).then(function(a){E.page=a,E.updatePageCommand=z(a),E.updateDraftCommand=A(a),E.editMode=!1})}function e(){return i.getVersionsByPageId(a.id).then(function(a){E.versions=a})}return b.all([d(),e()]).then(D.bind(null,c))}function z(a){return{pageId:a.pageId,tags:a.tags}}function A(a){var b=a.latestVersion,c=b.openGraph;return{pageId:a.pageId,title:b.title,metaDescription:b.metaDescription,openGraphTitle:c.title,openGraphDescription:c.description,openGraphImageId:c.image?c.image.ImageAssetId:void 0,showInSiteMap:b.showInSiteMap}}function B(){c.path("")}function C(a){E.globalLoadState.on(),a&&d.isFunction(a.on)&&a.on()}function D(a){E.globalLoadState.off(),a&&d.isFunction(a.off)&&a.off()}var E=this;k()}]),angular.module("cms.pages").controller("PageListController",["_","shared.entityVersionModalDialogService","shared.LoadState","shared.SearchQuery","shared.pageService","pages.pageTemplateService",function(a,b,c,d,e,f){function g(){k(),m.gridLoadState=new c,m.globalLoadState=new c,m.query=new d({onChanged:j}),m.filter=m.query.getFilters(),m.toggleFilter=h,h(!1),m.publish=i,l()}function h(b){m.isFilterVisible=a.isUndefined(b)?!m.isFilterVisible:b}function i(a){b.publish(a,m.globalLoadState.on).then(l)["catch"](m.globalLoadState.off)}function j(){h(!1),l()}function k(){m.workFlowStatus=[{name:"Draft"},{name:"Published"}],f.getAll().then(function(a){m.pageTemplates=a})}function l(){return m.gridLoadState.on(),e.getAll(m.query.getParameters()).then(function(a){m.result=a,m.gridLoadState.off()})}var m=this;g()}]),angular.module("cms.pages").controller("ChangePageUrlController",["$scope","$q","$location","shared.LoadState","shared.pageService","pages.customEntityService","options","close",function(a,b,c,d,e,f,g,h){function i(){j(),a.submitLoadState=new d,a.formLoadState=new d(!0),a.save=l,a.close=h,a.localesLoaded=m.resolve,a.webDirectoriesLoaded=n.resolve,a.formLoadState.offWhen(m,n,k())}function j(){var b=g.page,c=b.pageRoute;a.isCustomEntityRoute="CustomEntityDetails"===c.pageType,a.page=b,a.command={pageId:b.pageId,localeId:c.locale?c.locale.localeId:void 0,webDirectoryId:c.webDirectory.webDirectoryId},a.isCustomEntityRoute?a.command.customEntityRoutingRule=c.urlPath:a.command.urlPath=c.urlPath}function k(){if(a.isCustomEntityRoute)return f.getAllRoutingRules().then(function(b){a.routingRules=b});var c=b.defer();return c.resolve(),c}function l(){a.submitLoadState.on(),e.updateUrl(a.command).then(g.onSave).then(h)["finally"](a.submitLoadState.off)}var m=b.defer(),n=b.defer();i()}]),angular.module("cms.pages").controller("DuplicatePageController",["$scope","$q","$location","shared.LoadState","shared.pageService","pages.customEntityService","options","close",function(a,b,c,d,e,f,g,h){function i(){j(),a.submitLoadState=new d,a.formLoadState=new d(!0),a.save=l,a.close=h,a.localesLoaded=n.resolve,a.webDirectoriesLoaded=o.resolve,a.formLoadState.offWhen(n,o,k())}function j(){var b=g.page,c=b.pageRoute;a.isCustomEntityRoute="CustomEntityDetails"===c.pageType,a.page=b,a.command={pageToDuplicateId:b.pageId,localeId:c.locale?c.locale.localeId:void 0,webDirectoryId:c.webDirectory.webDirectoryId,title:"Copy of "+b.latestVersion.title},a.isCustomEntityRoute?a.command.customEntityRoutingRule=c.urlPath:a.command.urlPath=c.urlPath+"-copy"}function k(){if(a.isCustomEntityRoute)return f.getAllRoutingRules().then(function(b){a.routingRules=b});var c=b.defer();return c.resolve(),c}function l(){a.submitLoadState.on(),e.duplicate(a.command).then(m).then(h)["finally"](a.submitLoadState.off)}function m(a){c.path("/"+a)}var n=b.defer(),o=b.defer();i()}]);