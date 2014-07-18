/**
 * @class App.wins.winSystemMessages
 * Класс окна для вывода системных сообщений.
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @version 1.0
 * @since 05.04.2013
 */

Ext.define('Common.wins.winSystemMessages', {

	extend: 'Common.wins.winLocalMessages',
	alias : 'winsysmessage',
	title : 'Журнал системных сообщений',
	width : 400,
	height: 300,

	createLocalModel: function () {
		// Модель системных сообщений
		Ext.define('EnSystemMessage', {
			extend    : 'Ext.data.Model',
			fields    : [
				{name: 'id_message', type: 'int'},
				{name: 'iddate', type: 'date'},
				{name: 'message', type: 'string'},
				{name: 'isread', type: 'int'},
				{name: 'idtype', type: 'string'}
			],
			idProperty: 'id_message'
		});
		this.localModelName = 'EnSystemMessage';
	},

	getGridColumns: function () {
		return [
			{xtype: 'rownumberer', width: 40, sortable: false, align: 'center'},
			{xtype: 'datecolumn', text: 'Дата', dataIndex: 'iddate', format: 'Y-m-d H:i:s', flex: 1},
			{text: 'Сообщение', dataIndex: 'message', flex: 2}
		];
	},

	acClearAll: function () {
		this.callParent();
		this.desktop.setMessageCount(0);
	},

	acCheckAll: function () {
		var me = this;
		me.store.each(function (record, index, length) {
			var me = this;
			if (record.get('isread') === 0) {
				record.set('isread', 1);
				me.desktop.decMessageCount();
			}
		}, me);
	},

	onRowDoubleClick: function (grid, record) {
		var notread = record.get('isread') === 0;
		if (notread) {
			record.set('isread', 1);
			this.desktop.decMessageCount();
		}
	},

	destroy: function () {
		delete this.store;
		this.callParent();
	}

});
