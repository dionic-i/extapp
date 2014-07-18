/**
 * @class App.wins.winLocalMessages
 * Абстрактный класс вывода окна локальных сообщений
 *
 * @author Ilya Petrushenko
 * @version 1.0
 * @created 05.04.2013
 */

Ext.define('Common.wins.winLocalMessages', {

	extend     : 'Ext.window.Window',
	layout     : 'fit',
	shadow     : false,
	autoShow   : false,
	autoDestroy: false,
	minimazable: false,
	maximizable: false,
	closable   : false,
	width      : 400,
	height     : 300,

	initComponent   : function () {
		var me = this;

		me.createToolbar();
		me.createLocalModel();
		me.createStore();

		me.items = [
			{
				xtype     : 'grid',
				border    : false,
				store     : me.store,
				viewConfig: {
					getRowClass: function (record) {
						return record.get('isread') === 0 ? 'child-row' : '';
					}
				},
				columns   : me.getGridColumns(),
				listeners : {
					itemdblclick: {
						fn   : me.onRowDoubleClick,
						scope: me
					}
				}
			}
		];
		me.callParent();
	},

	// Метод определения модели локальных данных
	createLocalModel: Ext.emptyFn,

	// Метод определения колонок грида
	getGridColumns  : Ext.emptyFn,

	acCheckAll: Ext.emptyFn,

	onRowDoubleClick: Ext.emptyFn,

	createToolbar: function () {
		var me = this;
		me.tbar = Ext.create('Ext.toolbar.Toolbar', {
			height: 30,
			items : [
				{
					iconCls: 'i_delete_all',
					handler: me.acClearAll,
					tooltip: 'Очистить',
					scope  : me
				},
				{
					iconCls: 'i_check_all',
					handler: me.acCheckAll,
					tooltip: 'Отметить все',
					scope  : me
				},
				'->',
				{
					iconCls: 'i_exit',
					handler: me.acExit,
					tooltip: 'Выход',
					scope  : me
				}
			]
		});
	},

	createStore: function () {
		var me = this;
		try {
			me.store = Ext.create('Ext.data.Store', {
				model: me.localModelName,
				proxy: {
					id    : me.localModelName + '-proxy',
					type  : 'sessionstorage',
					reader: {
						type: 'json',
						root: 'data'
					}
				}
			});
		}
		catch (e) {
			console.log('Ошибка создания sessionstorage');
		}
	},

	acExit: function () {
		this.hide();
	},

	acClearAll: function () {
		this.store.removeAll();
	},

	destroy: function () {
		delete this.store;
		this.callParent();
	}

});
