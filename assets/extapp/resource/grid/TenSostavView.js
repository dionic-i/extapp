/*
 * @class Common.grid.TenSostavView
 *
 * @author Ilya Petrushenko
 * @version 0.1
 * @since 01.11.2013
 */

Ext.define('Common.grid.TenSostavView', {

	extend: 'Common.grid.TenGridView',
	alias : 'widget.ensostavview',

	acSostav: function () {
		var me = this;
		if (me.activeRecord && me.sostavAction) {
			App.Req.async({
				actionUrl: me.sostavAction,
				params   : {
					storeId: me.store.storeId,
					record : me.activeRecord.getLikeObject()
				},
				sync     : false,
				func     : Common.EMan.onCreateWindow,
				inst     : Common.EMan
			});
		}
	}

});
