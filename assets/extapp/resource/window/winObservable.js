/**
 * @class winRefUniversal
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since 22.02.2013
 */

Ext.define('Common.wins.winObservable', {

	extend: 'Common.wins.winUniversal',

	initComponent: function () {
		var me = this;
		me.addEvents('beforeexit');
		me.callParent();
	},

	doItemListeners: function () {
		var me = this;
		me.gridview.on('afterexcelreport', me.doAfterLoadExcel, me);
		me.gridview.on('changerecords', me.doAfterChangeRecs, me);
	},

	doAfterLoadExcel: function (grid, data) {
		this.desktop.addReportMessage(data.report);
	},

	doAfterChangeRecs: function (dis) {
		this.wintoolbar.i_exit.setDisabled(dis);
	},

	acExit: function () {
		var me = this;
		me.fireEvent('beforeexit', me, me.gridview);
		me.destroy();
	},

	acRefresh: function () {
		this.gridview.getStore().load();
	},

	acChoicePeriod: function () {
		var me = this,
			bd = me.wintoolbar.i_beg_date.text,
			ed = me.wintoolbar.i_end_date.text,
			format = me.getPeriodFormat();

		return Ext.create('Common.wins.winSelectPeriod', {
			begvalue : Ext.Date.parse(bd, format),
			endvalue : Ext.Date.parse(ed, format),
			listeners: {
				selectperiod: {
					fn   : this.onAfterSelectPeriod,
					scope: this
				}
			}
		});
	},

	onAfterSelectPeriod: function (bd, ed) {
		var me = this,
			format = me.getPeriodFormat();
		me.wintoolbar.i_beg_date.setText(Ext.Date.format(bd, format));
		me.wintoolbar.i_end_date.setText(Ext.Date.format(ed, format));
	},

	getPeriodFormat: function () {
		var me = this, pm = 'd.m.Y';
		if (me.periodMode) {
			switch (me.periodMode) {
				case App.Util.PM_NONE:
				case App.Util.PM_ONLY_DAY:
					pm = 'd.m.Y';
					break;
				case App.Util.PM_WITH_HOUR:
					pm = 'd.m.Y H';
					break;
				case App.Util.PM_WITH_MINUTES:
					pm = 'd.m.Y H:i';
					break;
			}
		}
		return pm;
	},

	destroy: function () {
		var me = this;
		me.gridview.destroy();
		delete me.gridview;
		delete me.dataset;
		me.callParent();
	}

});
