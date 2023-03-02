/**
 * @license jQuery UI Multiselect
 *
 * Authors:
 *  Michael Aufreiter (quasipartikel.at)
 *  Yanick Rochon (yanick.rochon[at]gmail[dot]com)
 * 
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * http://www.quasipartikel.at/multiselect/
 *
 * UPDATED by Oleg Kiriljuk (oleg.kiriljuk@ok-soft-gmbh.com) to support jQuery 1.6 and hight
 * (the usage of jQuery.attr and jQuery.removeAttr is replaced to the usage of jQuery.prop
 *  in case of working with selected options of select)
 * 
 * Depends:
 *	ui.core.js
 *	ui.sortable.js
 *
 * Optional:
 * localization (http://plugins.jquery.com/project/localisation)
 * scrollTo (http://plugins.jquery.com/project/ScrollTo)
 * 
 * Todo:
 *  Make batch actions faster
 *  Implement dynamic insertion through remote calls
 */
!function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery","jquery-ui/sortable"],i):"object"==typeof module&&module.exports?module.exports=function(t,e){return void 0===e&&(e="undefined"!=typeof window?require("jquery"):require("jquery")(t||window)),require("jquery-ui/sortable"),i(e),e}:i(jQuery)}(function(c){c.widget("ui.multiselect",{options:{guiStyle:"jQueryUI",iconSet:"jQueryUI",locale:"en-US",sortable:!0,searchable:!0,doubleClickable:!0,animated:"fast",show:"slideDown",hide:"slideUp",dividerLocation:.6,availableFirst:!1,nodeComparator:function(t,e){var i=t.text(),s=e.text();return i==s?0:i<s?-1:1}},_getLabel:function(t){var e=c.jgrid.getRes(c.jgrid.locales[this.options.locale],t);return void 0===e&&(e=c.jgrid.getRes(c.jgrid.locales["en-US"],t)),e},_getGuiStyles:function(t){var e=c.jgrid.getRes(c.jgrid.guiStyles[this.options.guiStyle],t);return void 0===e&&(e=c.jgrid.getRes(c.jgrid.guiStyles.jQueryUI,t)),e},_getIcon:function(t){var e=c.jgrid.getIcon(this.options.iconSet,t);return""===e&&(e=c.jgrid.getRes(c.jgrid.icons.jQueryUI,t)),e},_create:function(){this.element.hide(),this.id=this.element.attr("id"),this.container=c('<div class="'+this._getGuiStyles("multiselect.container")+'"></div>').insertAfter(this.element),this.count=0,this.selectedContainer=c('<div class="selected"><div class="'+this._getGuiStyles("multiselect.panel")+'"></div></div>').appendTo(this.container),this.availableContainer=c('<div class="available"><div class="'+this._getGuiStyles("multiselect.panel")+'"></div></div>')[this.options.availableFirst?"prependTo":"appendTo"](this.container),this.selectedActions=c('<div class="actions '+this._getGuiStyles("multiselect.heading")+'"><span class="count">0 '+this._getLabel("multiselect.itemsCount")+'</span><div><a href="#" class="remove-all">'+this._getLabel("multiselect.removeAll")+"</a></div></div>").appendTo(this.selectedContainer.children()),this.availableActions=c('<div class="actions '+this._getGuiStyles("multiselect.heading")+'"><input type="text" class="search '+this._getGuiStyles("multiselect.search")+'"/><div><a href="#" class="add-all">'+this._getLabel("multiselect.addAll")+"</a></div></div>").appendTo(this.availableContainer.children()),this.selectedList=c('<ul class="selected '+this._getGuiStyles("multiselect.list")+'"></ul>').bind("selectstart",function(){return!1}).appendTo(this.selectedContainer.children()),this.availableList=c('<ul class="available '+this._getGuiStyles("multiselect.list")+'"></ul>').bind("selectstart",function(){return!1}).appendTo(this.availableContainer.children());var i=this;if(this.container.css({"min-width":"470px",margin:"auto"}),"jQueryUI"===this.options.guiStyle)this.selectedContainer.css({width:100*this.options.dividerLocation+"%"}),this.availableContainer.css({width:100-100*this.options.dividerLocation+"%"});else if("bootstrap"===this.options.guiStyle||"bootstrap4"===this.options.guiStyle){var t=Math.round(12*this.options.dividerLocation);this.selectedContainer.addClass("col-sm-"+t),this.availableContainer.addClass("col-sm-"+(12-t))}this.selectedList.height(Math.max(this.element.height()-this.selectedActions.height(),1)),this.availableList.height(Math.max(this.element.height()-this.availableActions.height(),1)),this.options.animated||(this.options.show="show",this.options.hide="hide"),this._populateLists(this.element.find("option")),this.options.sortable&&this.selectedList.sortable({placeholder:"ui-state-highlight",axis:"y",update:function(t,e){i.selectedList.find("li").each(function(){c(this).data("optionLink")&&c(this).data("optionLink").remove().appendTo(i.element)})},receive:function(t,e){e.item.data("optionLink").prop("selected",!0),i.count+=1,i._updateCount(),i.selectedList.children(".ui-draggable").each(function(){c(this).removeClass("ui-draggable"),c(this).data("optionLink",e.item.data("optionLink")),c(this).data("idx",e.item.data("idx")),i._applyItemState(c(this),!0)}),setTimeout(function(){e.item.remove()},1)}}),this.options.searchable?this._registerSearchEvents(this.availableContainer.find("input.search")):c(".search").hide(),this.container.find(".remove-all").click(function(){return i._populateLists(i.element.find("option").prop("selected",!1)),!1}),this.container.find(".add-all").click(function(){var e=i.element.find("option").not(":selected");return 1<i.availableList.children("li:hidden").length?i.availableList.children("li").each(function(t){c(this).is(":visible")&&c(e[t-1]).prop("selected",!0)}):e.prop("selected",!0),i._populateLists(i.element.find("option")),!1})},destroy:function(){this.element.show(),this.container.remove(),c.Widget.prototype.destroy.apply(this,arguments)},_populateLists:function(t){this.selectedList.children(".ui-element").remove(),this.availableList.children(".ui-element").remove(),this.count=0;var s=this;c(t.map(function(t){var e=c(this).is(":selected"),i=s._getOptionNode(this).appendTo(e?s.selectedList:s.availableList).show();return e&&(s.count+=1),s._applyItemState(i,e),i.data("idx",t),i[0]}));this._updateCount(),s._filter.apply(this.availableContainer.find("input.search"),[s.availableList])},_updateCount:function(){this.element.trigger("change"),this.selectedContainer.find("span.count").text(this.count+" "+this._getLabel("multiselect.itemsCount"))},_getOptionNode:function(t){t=c(t);var e=c('<li class="ui-element '+this._getGuiStyles("multiselect.listItem")+'" title="'+(t.attr("title")||t.text())+'"><span/>'+t.text()+'<a href="#" class="action"><span class="ui-corner-all"/></a></li>').hide();return e.data("optionLink",t),e},_cloneWithData:function(t){var e=t.clone(!1,!1);return e.data("optionLink",t.data("optionLink")),e.data("idx",t.data("idx")),e},_setSelected:function(t,e){if(t.data("optionLink").prop("selected",e),e){var i=this._cloneWithData(t);return t[this.options.hide](this.options.animated,function(){c(this).remove()}),i.appendTo(this.selectedList).hide()[this.options.show](this.options.animated),this._applyItemState(i,!0),i}var s=this.availableList.find("li"),n=this.options.nodeComparator,l=null,a=t.data("idx"),o=n(t,c(s[a]));if(o){for(;0<=a&&a<s.length;)if(0<o?a++:a--,o!=n(t,c(s[a]))){l=s[0<o?a:a+1];break}}else l=s[a];var r=this._cloneWithData(t);return l?r.insertBefore(c(l)):r.appendTo(this.availableList),t[this.options.hide](this.options.animated,function(){c(this).remove()}),r.hide()[this.options.show](this.options.animated),this._applyItemState(r,!1),r},_applyItemState:function(t,e){e?(this.options.sortable?t.children("span").addClass(this._getIcon("multiselect.arrow")).removeClass("ui-helper-hidden"):t.children("span").removeClass(this._getIcon("multiselect.arrow")).addClass("ui-helper-hidden"),t.find("a.action span").removeClass(this._getIcon("multiselect.plus")).addClass(this._getIcon("multiselect.minus")),this._registerRemoveEvents(t.find("a.action"))):(t.children("span").removeClass(this._getIcon("multiselect.arrow")).addClass("ui-helper-hidden"),t.find("a.action span").removeClass(this._getIcon("multiselect.minus")).addClass(this._getIcon("multiselect.plus")),this._registerAddEvents(t.find("a.action"))),this._registerDoubleClickEvents(t),this._registerHoverEvents(t)},_filter:function(t){var e=c(this),i=t.children("li"),s=i.map(function(){return c(this).text().toLowerCase()}),n=c.trim(e.val().toLowerCase()),l=[];n?(i.hide(),s.each(function(t){-1<this.indexOf(n)&&l.push(t)}),c.each(l,function(){c(i[this]).show()})):i.show()},_registerDoubleClickEvents:function(e){this.options.doubleClickable&&e.dblclick(function(t){0===c(t.target).closest(".action").length&&e.find("a.action").click()})},_registerHoverEvents:function(t){t.removeClass("ui-state-hover"),t.mouseover(function(){c(this).addClass("ui-state-hover")}),t.mouseout(function(){c(this).removeClass("ui-state-hover")})},_registerAddEvents:function(t){var e=this;t.click(function(){e._setSelected(c(this).parent(),!0);return e.count+=1,e._updateCount(),!1}),this.options.sortable&&t.each(function(){c(this).parent().draggable({connectToSortable:e.selectedList,helper:function(){var t=e._cloneWithData(c(this)).width(c(this).width()-50);return t.width(c(this).width()),t},appendTo:e.container,containment:e.container,revert:"invalid"})})},_registerRemoveEvents:function(t){var e=this;t.click(function(){return e._setSelected(c(this).parent(),!1),e.count-=1,e._updateCount(),!1})},_registerSearchEvents:function(t){var e=this;t.focus(function(){c(this).addClass("ui-state-active")}).blur(function(){c(this).removeClass("ui-state-active")}).keypress(function(t){if(13==t.keyCode)return!1}).keyup(function(){e._filter.apply(this,[e.availableList])})}});var t={de:{addAll:"Alles hinzufügen",removeAll:"Alles entfernen",itemsCount:"ausgewählte Artikel"},en:{addAll:"Add all",removeAll:"Remove all",itemsCount:"items selected"},fr:{addAll:"Ajouter tout",removeAll:"Enlever tout",itemsCount:"éléments sélectionnés"},it:{addAll:"Aggiungere tutto",removeAll:"Rimuovere tutto",itemsCount:"elementi selezionati"}};c.jgrid=c.jgrid||{},c.extend(!0,c.jgrid,{locales:{de:{multiselect:t.de},"de-DE":{multiselect:t.de},en:{multiselect:t.en},"en-US":{multiselect:t.en},fr:{multiselect:t.fr},"fr-FR":{multiselect:t.fr},it:{multiselect:t.it},"it-IT":{multiselect:t.it}},guiStyles:{jQueryUI:{multiselect:{container:"ui-multiselect ui-helper-clearfix ui-widget",panel:"",heading:"ui-widget-header ui-helper-clearfix",list:"",listItem:"ui-state-default",search:"ui-widget-content ui-corner-all"}},bootstrap:{multiselect:{container:"ui-multiselect-bootstrap",panel:"panel panel-default",heading:"panel-heading",list:"list-group",listItem:"list-group-item",search:"form-control input-sm"}},bootstrap4:{multiselect:{container:"ui-multiselect-bootstrap",panel:"panel panel-default",heading:"panel-heading",list:"list-group",listItem:"list-group-item",search:"form-control input-sm"}}},icons:{jQueryUI:{multiselect:{minus:"ui-icon-minus",plus:"ui-icon-plus",arrow:"ui-icon-arrowthick-2-n-s"}},fontAwesome:{multiselect:{minus:"fa-minus",plus:"fa-plus",arrow:"fa-arrows-v"}},fontAwesome5:{multiselect:{minus:"fa-minus",plus:"fa-plus",arrow:"fa-arrows-alt-v"}},glyph:{multiselect:{minus:"glyphicon-minus",plus:"glyphicon-plus",arrow:"glyphicon-resize-vertical"}}}})});
//# sourceMappingURL=ui.multiselect.js.map