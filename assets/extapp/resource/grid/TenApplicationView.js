/**
 * @class App.view.grid.TenApplicationView
 *
 *
 * @author Petrushenko Ilya
 * @version 0.1
 * @since 15.04.2013
 */

Ext.define('Common.grid.TenApplicationView', {

	extend: 'Ext.view.View',
	alias : 'widget.appviewer',

	tpl: [
		'<tpl for=".">',
		'<div class="thumb-wrap">',
		'<div class="thumb">',
		'<img src="../../../images/{thumb}" />',
		'</div>',
		'<span><a href="{url}" target="_blank">{name}</a></span>',
		'</div>',
		'</tpl>'
	],

	itemSelector: 'div.thumb-wrap',
	singleSelect: false,
	cls         : 'x-image-view',
	autoScroll  : true,

	initComponent: function () {
		var me = this;

		me.store = Ext.create('Ext.data.Store', {
			autoLoad: true,
			fields  : ['name', 'thumb', 'url'],
			proxy   : {
				type  : 'ajax',
				url   : '/encore/default/getuserapplications',
				reader: {
					type: 'json',
					root: 'data'
				}
			}
		});

		me.callParent();
	}

});
