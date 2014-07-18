Ext.define('Common.panel.TenTreePanel', {

	extend: 'Ext.tree.Panel',
	alias : 'widget.entreepanel',

	mixins: {
		tlbfactory: 'Common.toolbar.TenToolbarFactory'
	},

	initComponent : function () {
		var me = this;
		me.mixins.tlbfactory.createSuspended(me);
		me.store = Ext.StoreMgr.lookup(me.storeId);
		me.comboStore = Ext.StoreMgr.lookup(me.comboStoreId);
		me.ttreebar.i_combo_gr.on('change', me.onAfterComboChange, me);
		me.callParent();

		me.on({
			selectionchange: me.onAfterSelectionChange,
			scope          : me
		});
	},

	// @virtual
	changeBtnState: function () {
	},

	/**
	 * Обработчики действий кнопок управления
	 */

	acRefresh: function () {
		var me = this;
		me.comboStore.load({
			callback: me.onAfterComboLoad,
			scope   : me
		});
	},

	acGroups: function (btn) {
		var me = this;
		App.Req.async({
			actionUrl: btn.endata.actionUrl,
			params   : {
				storeId: me.store.storeId
			},
			func     : Common.EMan.onCreateWindow,
			inst     : Common.EMan
		});
	},

	acGroupPriv: function (btn) {
		var me = this,
			idSp,
			record;

		if (me.comboStore.getCount() > 0) {
			idSp = me.ttreebar.i_combo_gr.getValue();
			record = me.ttreebar.i_combo_gr.findRecordByValue(idSp)
			App.Req.async({
				actionUrl: btn.endata.actionUrl,
				params   : {
					storeId: me.comboStore.storeId,
					idSp: idSp,
					name: record.get('IDNAME')
				},
				func     : Common.EMan.onCreateWindow,
				inst     : Common.EMan
			});
		}
	},

	acSostavSp: function (btn) {
		var me = this,
			date = me.cmpWin.wintoolbar.i_date.getValue();

		if (me.activeRecord) {
			App.Req.async({
				actionUrl: btn.endata.actionUrl,
				params   : {
					storeId: me.store.storeId,
					iddate : Ext.Date.format(date, 'Y-m-d'),
					record : me.activeRecord.getLikeObject()
				},
				func     : Common.EMan.onCreateWindow,
				inst     : Common.EMan,
				extra    : {
					beforeexit: {
						fn   : me.onAfterExitGroupSostav,
						scope: me
					}
				}
			});
		}
	},

//	acDeactivate: function () {
//	},
//
//	acPereraschet: function () {
//	},

	acRefreshTree: function () {
		var me = this;
		me.store.load({
			callback: me.onAfterTreeStoreLoad,
			scope   : me
		});
	},

	onAfterTreeStoreLoad: function () {
		var me = this,
			rn = me.store.getRootNode();
		if (rn) {
			me.getSelectionModel().select(0);
		}
	},

	onAfterComboLoad: function () {
		var me = this;
		if (me.comboStore.getCount() > 0) {
			me.store.firstLoad = false;
			me.ttreebar.i_combo_gr.select(me.comboStore.getAt(0));
		}
	},

	onAfterComboChange: function (cmb, nv, ov) {
		var me = this;
		me.store.getProxy().setParam('idsrez', nv);
		me.acRefreshTree();
	},

	onAfterSelectionChange: function (sm, records) {
		this.activeRecord = records[0];
		this.changeBtnState();
	},

	onAfterExitGroupSostav: function (win, grid) {
		var me = this;
		if (grid.doneSync) {
			me.acRefreshTree();
		}
	},

	destroy: function () {
		var me = this;
		delete me.activeRecord;
		delete me.cmpWin;
		delete me.comboStore;

		// Удаление store
		App.Req.async({
			actionUrl: '/encore/dataset/closedataset',
			params   : {
				storeId: me.store.storeId,
				stores : [
					me.store.storeId,
					me.comboStoreId
				]
			}
		});
		me.callParent();
	}

});