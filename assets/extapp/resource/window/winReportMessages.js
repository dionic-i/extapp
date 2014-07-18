/**
 * @class App.wins.winSystemMessages
 * Класс окна для вывода системных сообщений
 *
 * @author Ilya Petrushenko
 * @version 1.0
 * @created 05.04.2013
 */

Ext.define('Common.wins.winReportMessages', {

	extend: 'Common.wins.winLocalMessages',
	alias : 'winrepmessage',
	title : 'Журнал сформированных отчётов',
	width : 600,
	height: 300,
	deleteUrl: '/report/default/deletereport',

	createLocalModel: function () {
		Ext.define('EnReportMessage', {
			extend    : 'Ext.data.Model',
			fields    : [
				{name: 'id_report', type: 'int'},
				{name: 'iddate', type: 'date'},
				{name: 'title', type: 'string'},
				{name: 'link', type: 'string'},
				{name: 'filename', type: 'string'},
				{name: 'isread', type: 'int'}
			],
			idProperty: 'id_report'
		});
		this.localModelName = 'EnReportMessage';
	},

	getGridColumns: function () {
		return [
			{xtype: 'rownumberer', width: 40, sortable: false, align: 'center'},
			{xtype: 'datecolumn', text: 'Дата', dataIndex: 'iddate', format: 'Y-m-d H:i:s', flex: 1},
			{text: 'Название', dataIndex: 'title', flex: 2},
			{
				xtype: 'actioncolumn',
				width: 80,
				items: [
					{
						iconCls: 'i_download_file',
						handler: this.acDownloadFile,
						scope  : this,
						tooltip: 'Загрузить файл',
						width  : 20
					},
					{
						iconCls: 'i_delete',
						handler: this.acDeleteFile,
						scope  : this,
						tooltip: 'Удалить файл',
						width  : 20
					}
				]
			}
		];
	},

	deleteReportFiles: function(records) {
		var me = this,
			files = [];

		Ext.Array.each(records, function(item) {
			files.push(item.get('filename'));
			me.store.remove(item);
			me.desktop.decReportCount();
		});

		App.Req.async({
			actionUrl: me.deleteUrl,
			params: {repfiles: files}
		});
	},

	acDownloadFile: function (view, rowIndex, colIndex, item, e, record, row) {
		window.location.href = record.get('link');
		record.set('isread', 1);
	},

	acDeleteFile: function (view, rowIndex, colIndex, item, e, record, row) {
		this.deleteReportFiles([record]);
	},

	acClearAll: function () {
		this.deleteReportFiles(this.store.getRange());
	},

	acCheckAll: function () {
		var me = this;
		me.store.each(function (record, index, length) {
			if (record.get('isread') === 0) {
				record.set('isread', 1);
			}
		}, me);
	},

	onRowDoubleClick: function (grid, record) {
		record.set('isread', 1);
	},

	destroy: function () {
		delete this.store;
		this.callParent();
	}

});
