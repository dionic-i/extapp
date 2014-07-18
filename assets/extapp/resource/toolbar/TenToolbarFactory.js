/**
 * @class App.widenings.TenToolbarFactory
 * Класс для создания suspend компонентов панелей.
 *
 * @author Petrushenko Ilya
 * @version 0.1
 * @since 06.05.2013
 */

Ext.define('Common.toolbar.TenToolbarFactory', {

	extend: 'Ext.Base',

	createSuspended: function (cmpPanel) {
		var me = cmpPanel, i = 0, obj;
		if (me.hasOwnProperty('suspendProps')) {
			for (i = 0; i < me.suspendProps.length; i++) {
				obj = Ext.clone(me[me.suspendProps[i]]);
				delete me[me.suspendProps[i]];
				me[me.suspendProps[i]] = me[obj.itemId] = App.Req.getToolbar({remote: false, config: obj}, me);
			}
		}
	},

	destroy: function () {
		delete this.cmpPanel;
		this.callParent();
	}

});