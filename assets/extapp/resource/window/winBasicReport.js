/**
 * @class winBasicReport
 * Класс окна для формирования общих отчётов.
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @version 0.1
 * @since 11.06.2013
 */

Ext.define('Common.wins.winBasicReport', {

	extend: 'Common.wins.winObservable',
	alias : 'widget.winbasicreport',

	initComponent: function () {
		var me = this;
		me.callParent();
		me.on('show', me.acRefresh, me, {single: me});
		me.reportsview.on('select', me.changeButtonsState, me);
		me.gridview.on('select', me.changeButtonsState, me);
	},

	doCreateItems: function (items) {
		var me = this;
		me.callParent([items]);

		me.items.push({
			xtype : 'container',
			layout: {
				type : 'hbox',
				align: 'stretch'
			},
			items : [
				me.gridview,
				me.reportsview
			]
		});
	},

	/**
	 * Метод изменения состояния кнопок toolbar
	 * @virtual
	 */
	changeButtonsState: function() {
		var me = this,
			srezes = me.gridview.getSelectionModel().getSelection(),
			report = me.reportsview.getSelectionModel().getSelection(),
			block = srezes.length === 0 || report.length === 0;

		console.log(block);

		me.wintoolbar.i_excel.setDisabled(block);
	},

	acCreateReport: function () {
		var me = this,
			srez = me.gridview.getSelectionModel().getSelection(),
			report = me.reportsview.getSelectionModel().getSelection(),
			begdate = Ext.Date.parse(me.wintoolbar.i_beg_date.text, 'd.m.Y'),
			enddate = Ext.Date.parse(me.wintoolbar.i_end_date.text, 'd.m.Y');

		if (!Ext.isArray(srez) || srez.length === 0) {
			App.Msg.Error('Не выбран суммарный показатель!');
			return false;
		}

		if (!Ext.isArray(report) || report.length === 0) {
			App.Msg.Error('Не выбран тип отчёта!');
			return false;
		}

		App.Req.async({
			actionUrl: me.links.report,
			params   : {
				storeId : me.gridview.store.storeId,
				idsrez  : srez[0].get('ID_SREZ'),
				srezname: srez[0].get('IDNAME'),
				idtype  : report[0].get('ID'),
				begdate : Ext.Date.format(begdate, 'Y-m-dH:i:s'),
				enddate : Ext.Date.format(enddate, 'Y-m-dH:i:s')
			},
			sync     : false,
			func     : me.onAfterGetReport,
			inst     : me
		});

		return true;
	},

	onAfterGetReport: function (data) {
		var me = this;
		if (data.hasOwnProperty('report')) {
			me.desktop.addReportMessage(data.report);
		}
	},

	destroy: function () {
		var me = this;
		me.reportsview.destroy();
		delete me.reportsview;
		delete me.repEnStore;
		me.callParent();
	}

});
