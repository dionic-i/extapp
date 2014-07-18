/**
 * @class App.wins.winTree
 *
 * @author Ilya Petrushenko  <ilya.petrushenko@yandex.ru>
 * @version 0.1
 * @since 06.08.2013
 */

Ext.define('Common.wins.winTree', {

	extend: 'Common.wins.winUniversal',
	alias : 'widget.wintree',

	initComponent: function () {
		var me = this;
		me.items = [me.treeview];
		me.callParent();
		me.on('show', me.onAfterShow, me, {single: true});
	},

	acExit: function () {
		this.destroy();
	},

	onAfterShow: function () {
		var me = this;
		if (me.wintoolbar.i_date) {
			me.wintoolbar.i_date.on('change', me.onDateChange, me);
		}
		me.maximize();
		me.treeview.acRefresh();
	},

	onDateChange: function (f, newValue, oldValue) {
		var me = this;
		me.treeDataset.getProxy().setParam('begdate', Ext.Date.format(newValue, 'Y-m-d'));
		me.acRefresh();
	},

	acRefresh: function () {
		this.treeview.acRefreshTree();
	},

	destroy: function () {
		var me = this;
		me.treeview.destroy();
		delete me.treeview;
		me.callParent();
	}

});
