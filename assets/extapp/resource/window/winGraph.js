/**
 * @class winGraph
 * Окно для вывод графика и табличных данных по схемам и срезам.
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @version 0.2
 * @since 28.03.13
 */

Ext.define('Common.wins.winGraph', {

	extend: 'Common.wins.winObservable',
	alias : 'widget.wingraph',

	initComponent: function () {
		var me = this;

		me.autoTask = Ext.util.TaskManager.newTask({
			run     : me.doAutoRefresh,
			scope   : me,
			interval: me.autoTimeout
		});

		me.activeBtn = null;
		me.intervalBtn = null;

		// Флаг изменения типа энергии
		me.changeBtn = false;

		// Флаг изменения интервала срезов
		me.changeInt = true;

		// Флаг отображения графика
		me.graphIsShow = false;

		// Флаг изменения периода
		me.changePeriod = true;

		me.callParent();

		me.on('resize', me.onAfterResize, me);
		me.on('show', me.onAfterShow, me, {single: true});
	},

	doCreateItems: function (items) {
		var me = this;
		me.callParent([items]);
		me.items = [
			{
				xtype    : 'tabpanel',
				activeTab: 0,
				border   : false,
				items    : [me.gridview, me.chartpanel],
				listeners: {
					tabchange: {
						fn   : me.onTabChange,
						scope: me
					}
				}
			}
		];
	},

	acAutoRefresh: function (button, pressed) {
		var me = this;
		if (pressed) {
			me.autoTask.start();
		}
		else {
			me.autoTask.stop();
		}
	},

	doAutoRefresh: function () {
		var me = this,
			proxy = me.dataset.getProxy(),
			now = new Date;
		proxy.setParam('enddate', Ext.Date.format(now, 'Y-m-dH:i:s'));
		me.changePeriod = true;
		me.wintoolbar.i_end_date.setText(Ext.Date.format(now, 'd.m.Y H:i'));
		me.doChangeParams(false);
	},

	acRefresh: function () {
		this.doChangeParams(true);
	},

	acChangeEnergy: function (btn, checked) {
		var me = this;
		if (checked) {
			me.activeBtn = btn;
			me.changeBtn = true;
			me.changePeriod = false;
			me.changeInt = false;
			me.doChangeParams(false);
		}
	},

	acChangeInterval: function (btn, checked) {
		var me = this,
			proxy = me.dataset.getProxy(),
			format = me.getPeriodFormat(),
			bd = Ext.Date.parse(me.wintoolbar.i_beg_date.text, format),
			ed = Ext.Date.parse(me.wintoolbar.i_end_date.text, format),
			_old_btn;

		if (checked) {

			// Проверка периода при переключении дискретности данных
			_old_btn = me.intervalBtn;
			me.intervalBtn = btn;
			if (me.checkPeriod(bd, ed) === false) {
				me.intervalBtn = _old_btn;
				me.intervalBtn.toggle(true, true);
				btn.toggle(false, true);
				return false;
			}

			// Переключение дискретности
			me.changeInt = true;
			me.intervalBtn = btn;
			proxy.setParam('timesrez', me.intervalBtn.endata);
			me.changePeriod = false;
			me.changeBtn = false;
			me.doChangeParams(false);
		}
	},

	acChoicePeriod: function () {
		this.callParent().on('checkbetween', this.onCheckPeriod, this);
	},

	// @private
	doChangeParams: function (silent) {
		var me = this;
		if (me.graphIsShow) {
			me.doChangeGraph(silent);
		}
		else {
			me.doChangeGrid(silent);
		}
	},

	// @private
	doChangeGraph : function (silent) {
		var me = this,
			params = me.dataset.getProxy().getExtParams(),
			es = me.chartpanel.existSeries(),
			data,
			invSeries = false;

		if (me.changeBtn || me.changeInt || me.changePeriod || !es || silent) {
			params.mtype = me.activeBtn.endata;

			data = App.Req.sync({
				actionUrl: '/schema/default/getseries',
				params: params
			});

			// Изменили интервал или период - сохраняем графики, которые были скрыты
			if (me.changeBtn || me.changeInt || me.changePeriod) {
				var series = me.chartpanel.getChartSeries(true);
				invSeries = [];
				for (var i = 0; i < series.length; i++) {
					if (series[i].visible === false) {
						invSeries.push(i);
					}
				}
			}

			if (data) {
				me.chartpanel.addSeries(data, invSeries);
			}
		}
	},

	// @private
	doChangeGrid  : function (silent) {
		var me = this,
			vals;
		if (me.changeBtn) {
			vals = me.dataset.getProxy().getExtParams();
			vals.mtype = me.activeBtn.endata;
			App.Req.async({
				actionUrl: '/schema/default/gridreconfigure',
				params: vals,
				func  : me.onAfterReconfigureGrid,
				inst  : me
			});
		}

		if (me.changePeriod || me.changeInt || silent) {
			me.gridview.getStore().load();
		}
	},

	onAfterReconfigureGrid: function (data) {
		var me = this;
		Ext.define(data.model.modelClass, data.model);
		me.dataset.destroyStore();
		me.dataset = Ext.create(data.store.cmpClass, data.store);
		me.dataset.loadData(data.records);
		me.dataset.totalCount = data.total;
		Ext.suspendLayouts();
		me.gridview.reconfigure(me.dataset, data.columns);
		Ext.resumeLayouts(true);
	},

	checkPeriod: function (bd, ed) {
		var me = this,
			between = ed - bd,
			timesrez = me.intervalBtn.endata;

		var error =
			(timesrez === 1 && between > 24 * 60 * 60 * 1000) ||
				(timesrez === 6 && between > 24 * 60 * 60 * 1000 * 30) ||
				(timesrez === 144 && between > 24 * 60 * 60 * 1000 * 366);

		if (error) {
			App.Msg.Warning('Невозможно выгрузить данные в заданном интервале дат. Выберите другой диапозон или уменьшите дискретность.');
			return false;
		}

		return true;
	},

	onAfterSelectPeriod: function (bd, ed) {
		var me = this,
			proxy = me.dataset.getProxy();

		me.callParent([bd, ed]);
		proxy.setParam('begdate', Ext.Date.format(bd, 'Y-m-dH:i:s'));
		proxy.setParam('enddate', Ext.Date.format(ed, 'Y-m-dH:i:s'));

		me.changeBtn = false;
		me.changeInt = false;
		me.changePeriod = true;

		// Выключаем автообновление при смене периода
		me.autoTask.stop();
		me.doChangeParams(false);
	},

	onCheckPeriod: function (bd, ed) {
		var me = this,
			between = ed - bd,
			timesrez = me.intervalBtn.endata;

		var error =
			(timesrez === 1 && between > 24 * 60 * 60 * 1000) ||
				(timesrez === 6 && between > 24 * 60 * 60 * 1000 * 30) ||
				(timesrez === 6 && between > 24 * 60 * 60 * 1000 * 366);

		if (error) {
			App.Msg.Warning('Невозможно выгрузить данные в заданном интервале дат. Выберите другой диапозон или уменьшите дискретность.');
			return false;
		}

		return true;
	},

	onAfterResize: function () {
		this.gridview.setHeight(this.getHeight() - 100);
	},

	onAfterShow: function () {
		var me = this;
		me.wintoolbar.i_auto_update.toggle(true);
		me.maximize();
		me.activeBtn = me.wintoolbar.i_active;
		me.intervalBtn = me.wintoolbar.i_ten_minutes;
		me.doChangeParams(false);
	},

	onTabChange: function (tabPanel, newCard, oldCard) {
		var me = this;
		me.graphIsShow = (newCard === me.chartpanel);
		me.doChangeParams(false);
		me.changeBtn = false;
		me.changeInt = false;
		me.changePeriod = false;
	},

	destroy: function () {
		var me = this;
		me.chartpanel.destroy();
		delete me.chartpanel;
		me.autoTask.destroy();
		delete me.autoTask;
		me.callParent();
	}

});
