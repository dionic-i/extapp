/**
 * @class App.wins.winSelectPeriod
 * Класс окна для выбора периода
 *
 * @author Ilya Petrushenko
 * @version 1.0
 * @created 28.03.13
 */

Ext.define('Common.wins.winSelectPeriod', {

	extend   : 'Ext.window.Window',
	alias    : 'widget.winselectperiod',
	title    : 'Выбор периода',
	autoShow : true,
	height   : 200,
	width    : 520,
	layout   : 'fit',
	modal    : true,
	closable : false,
	resizable: false,
	shadow   : false,
	isday    : true,

	initComponent: function () {
		var me = this;
		me.addEvents(
			'selectperiod',
			'checkbetween'
		);
		me.createToolbar();
		me.createForm();
		Ext.apply(me, {
			x    : (window.innerWidth - 290) / 2,
			y    : (window.innerHeight - 85) / 2,
			tbar : me.toolbar,
			items: [me.form]
		});
		me.callParent();
	},

	createToolbar: function () {
		var me = this;
		me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
			height  : 30,
			defaults: {
				xtype: 'button'
			},
			items   : [
				{
					iconCls: 'i_select_period',
					tooltip: 'Выход с выбором',
					handler: me.acSelect,
					scope  : me
				},
				{
					xtype: 'tbspacer',
					width: 20
				},
				{
					iconCls: 'i_prev_date',
					tooltip: 'Предыдущий период',
					handler: me.acPrev,
					scope  : me
				},
				{
					iconCls      : 'i_today',
					tooltip      : 'Сегодня',
					pressed      : true,
					toggleGroup  : 'date',
					toggleHandler: me.acToday,
					scope        : me
				},
				{
					iconCls      : 'i_month',
					tooltip      : 'Текущий месяц',
					toggleGroup  : 'date',
					toggleHandler: me.acMonth,
					scope        : me
				},
				{
					iconCls: 'i_next_date',
					tooltip: 'Следующий период',
					handler: me.acNext,
					scope  : me
				},
				{
					xtype: 'tbspacer',
					width: 20
				},
				{
					iconCls: 'i_equal_date',
					tooltip: '= Началу периоду',
					handler: me.acEqualStart,
					scope  : me
				},
				{
					iconCls: 'i_equal_date',
					tooltip: '= Концу периоду',
					handler: me.acEqualEnd,
					scope  : me
				},
				{
					xtype: 'tbspacer',
					width: 20
				},
				{
					text   : '00:00',
					tooltip: 'Установить 00:00',
					handler: me.acMidnight,
					scope  : me
				},
				{
					text   : '23:59',
					tooltip: 'Установить 23:59',
					handler: me.acBeforeMidnight,
					scope  : me
				}

				,
				'->',

				{
					iconCls: 'i_exit',
					tooltip: 'Выход',
					handler: me.acExit,
					scope  : me
				}
			]
		});
	},

	createForm: function () {
		var me = this,
			bh, bm, eh, em;

		me.begvalue = me.begvalue || Ext.Date.clearTime(new Date());
		bh = me.begvalue.getHours();
		bm = me.begvalue.getMinutes();

		if (!me.endvalue) {
			me.endvalue = Ext.Date.add(Ext.Date.clearTime(new Date()), Ext.Date.HOUR, 23);
			me.endvalue = Ext.Date.add(me.endvalue, Ext.Date.MINUTE, 59);
		}
		eh = me.endvalue.getHours();
		em = me.endvalue.getMinutes();

		// Дата начала периода
		me.begDate = Ext.create('Ext.form.field.Date', {
			fieldLabel: 'Дата',
			labelWidth: 50,
			name      : 'begdate',
			value     : Ext.Date.clearTime(me.begvalue),
			format    : 'd.m.Y',
			editable  : false
		});

		me.begHour = Ext.create('Ext.form.field.Number', {
			fieldLabel: 'Час',
			labelWidth: 50,
			name      : 'beghour',
			value     : bh,
			minValue  : 0,
			maxValue  : 23
		});

		me.begMin = Ext.create('Ext.form.field.Number', {
			fieldLabel: 'Минута',
			labelWidth: 50,
			name      : 'begmin',
			value     : bm,
			minValue  : 0,
			maxValue  : 59
		});

		// Дата окончания периода
		me.endDate = Ext.create('Ext.form.field.Date', {
			fieldLabel: 'Дата',
			labelWidth: 50,
			name      : 'enddate',
			value     : Ext.Date.clearTime(me.endvalue),
			format    : 'd.m.Y',
			editable  : false
		});

		me.endHour = Ext.create('Ext.form.field.Number', {
			fieldLabel: 'Час',
			labelWidth: 50,
			name      : 'endhour',
			value     : eh,
			minValue  : 0,
			maxValue  : 23
		});

		me.endMin = Ext.create('Ext.form.field.Number', {
			fieldLabel: 'Минута',
			labelWidth: 50,
			name      : 'endmin',
			value     : em,
			minValue  : 0,
			maxValue  : 59
		});

		me.form = Ext.create('Ext.form.Panel', {
			frame : true,
			margin: 5,
			items : [
				{
					xtype   : 'container',
					layout  : 'hbox',
					defaults: {
						xtype      : 'fieldset',
						margin     : 2,
						collapsible: false,
						flex       : 1,
						layout     : 'vbox',
						defaults   : {
							flex  : 1,
							width : 180,
							margin: '4'
						}
					},
					items   : [
						{
							title: 'Начало периода',
							items: [
								me.begDate,
								me.begHour,
								me.begMin
							]
						},
						{
							title: 'Конец периода',
							items: [
								me.endDate,
								me.endHour,
								me.endMin
							]
						}
					]
				}
			]

		});
	},

	acSelect: function () {
		var me = this,
			form = me.form.getForm(),
			vls = form.getValues(),
			bd, ed;

		bd = Ext.Date.parse(vls.begdate, 'd.m.Y');
		ed = Ext.Date.parse(vls.enddate, 'd.m.Y');

		if (vls.beghour !== 0) {
			bd = Ext.Date.add(bd, Ext.Date.HOUR, vls.beghour);
		}

		if (vls.begmin !== 0) {
			bd = Ext.Date.add(bd, Ext.Date.MINUTE, vls.begmin);
		}

		if (vls.endhour !== 0) {
			ed = Ext.Date.add(ed, Ext.Date.HOUR, vls.endhour);
		}

		if (vls.endmin !== 0) {
			ed = Ext.Date.add(ed, Ext.Date.MINUTE, vls.endmin);
		}

		if (form.isValid()) {
			if (me.fireEvent('checkbetween', bd, ed) !== false) {
				me.fireEvent('selectperiod', bd, ed);
				me.acExit();
			}
		}
	},

	acExit : function () {
		this.close();
	},

	// Сегодня
	acToday: function () {
		var me = this;
		me.isday = true;
		me.begDate.setValue(Ext.Date.clearTime(new Date()));
		me.begHour.setValue(0);
		me.begMin.setValue(0);

		me.endDate.setValue(Ext.Date.clearTime(new Date()));
		me.endHour.setValue(23);
		me.endMin.setValue(59);
	},

	// Текущий месяц
	acMonth: function () {
		var me = this,
			vls = me.form.getForm().getValues(),
			bd = Ext.Date.parse(vls.begdate, 'd.m.Y');
		me.isday = false;

		me.begDate.setValue(Ext.Date.getFirstDateOfMonth(bd));
		me.begHour.setValue(0);
		me.begMin.setValue(0);

		me.endDate.setValue(Ext.Date.getLastDateOfMonth(bd));
		me.endHour.setValue(23);
		me.endMin.setValue(59);
	},

	// Предыдущий период
	acPrev : function () {
		var me = this,
			vls = me.form.getForm().getValues(),
			bd = Ext.Date.parse(vls.begdate, 'd.m.Y'),
			ed = Ext.Date.parse(vls.enddate, 'd.m.Y');

		if (me.isday) {
			me.begDate.setValue(Ext.Date.add(bd, Ext.Date.DAY, -1));
		}
		else {
			bd = Ext.Date.getFirstDateOfMonth(Ext.Date.add(bd, Ext.Date.MONTH, -1));
			ed = Ext.Date.getLastDateOfMonth(Ext.Date.add(ed, Ext.Date.MONTH, -1));
			me.begDate.setValue(bd);
			me.begHour.setValue(0);
			me.begMin.setValue(0);
			me.endDate.setValue(ed);
			me.endHour.setValue(23);
			me.endMin.setValue(59);
		}
	},

	// Следующий период
	acNext : function () {
		var me = this,
			vls = me.form.getForm().getValues(),
			bd = Ext.Date.parse(vls.begdate, 'd.m.Y'),
			ed = Ext.Date.parse(vls.enddate, 'd.m.Y');

		if (me.isday) {
			me.endDate.setValue(Ext.Date.add(ed, Ext.Date.DAY, 1));
		}
		else {
			bd = Ext.Date.getFirstDateOfMonth(Ext.Date.add(bd, Ext.Date.MONTH, 1));
			ed = Ext.Date.getLastDateOfMonth(Ext.Date.add(ed, Ext.Date.MONTH, 1));
			me.begDate.setValue(bd);
			me.begHour.setValue(0);
			me.begMin.setValue(0);
			me.endDate.setValue(ed);
			me.endHour.setValue(23);
			me.endMin.setValue(59);
		}
	},

	acEqualStart: function () {
		var me = this,
			vls = me.form.getForm().getValues(),
			bd = Ext.Date.parse(vls.begdate, 'd.m.Y');
		me.endDate.setValue(bd);
		me.endHour.setValue(vls.beghour);
		me.endMin.setValue(vls.begmin);
	},

	acEqualEnd: function () {
		var me = this,
			vls = me.form.getForm().getValues(),
			ed = Ext.Date.parse(vls.enddate, 'd.m.Y');
		me.begDate.setValue(ed);
		me.begHour.setValue(vls.endhour);
		me.begMin.setValue(vls.endmin);
	},

	acMidnight: function () {
		var me = this;
		me.begHour.setValue(0);
		me.begMin.setValue(0);
		me.endHour.setValue(0);
		me.endMin.setValue(0);
	},

	acBeforeMidnight: function () {
		var me = this;
		me.begHour.setValue(23);
		me.begMin.setValue(59);
		me.endHour.setValue(23);
		me.endMin.setValue(59);
	},

	destroy: function () {
		var me = this;
		delete me.begvalue;
		delete me.endvalue;

		me.begDate.destroy();
		delete me.begDate;
		me.begHour.destroy();
		delete me.begHour;
		me.begMin.destroy();
		delete me.begMin;

		me.endDate.destroy();
		delete me.endDate;
		me.endHour.destroy();
		delete me.endHour;
		me.endMin.destroy();
		delete me.endMin;

		me.form.destroy();
		delete me.form;

		me.toolbar.destroy();
		delete me.toolbar;
		me.callParent();
	}

});
