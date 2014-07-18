/*
 * @class Common.grid.TenLinkView
 * Класс для отображения грида с возможностью привязки объектов
 *
 * @author Petrushenko Ilya
 * @version 0.1
 * @since 12.12.2013
 */

Ext.define('Common.grid.TenLinkView', {

	extend: 'Common.grid.TenSostavView',
	alias : 'widget.enlinkview',

	changeButtonsState: function () {
		var me = this,
			linked;

		me.callParent();

		if (me.gridtoolbar.i_delete_all) {
			me.gridtoolbar.i_delete_all.setDisabled(true);
		}

		if (me.activeRecord) {
			linked = me.activeRecord.get('LINKED') == App.Util.LINKED;

			if (me.gridtoolbar.i_link) {
				me.gridtoolbar.i_link.setDisabled(linked);
			}

			if (me.gridtoolbar.i_showobject) {
				me.gridtoolbar.i_showobject.setDisabled(!linked);
			}

			if (me.gridtoolbar.i_delete) {
				me.gridtoolbar.i_delete.setDisabled(linked);
			}
		}
	},

	acLink: function () {
		var me = this;
		if (me.activeRecord && me.linkAction) {
			App.Req.async({
				actionUrl: me.linkAction,
				params   : {
					storeId: me.store.storeId,
					record : me.activeRecord.getLikeObject(),
					linked : me.activeRecord.get('LINKED') == App.Util.LINKED
				},
				sync     : false,
				func     : me.acRefresh,
				inst     : me,
				showTip  : true
			});
		}
	},

	acShowLinkObject: function () {
		var me = this;
		if (me.activeRecord && me.showAction) {
			App.Req.async({
				actionUrl: me.showAction,
				params   : {
					storeId: me.store.storeId,
					record : me.activeRecord.getLikeObject(),
					linked : me.activeRecord.get('LINKED')
				},
				sync     : false,
				func     : Common.EMan.onCreateWindow,
				inst     : Common.EMan
			});
		}
	}

});
