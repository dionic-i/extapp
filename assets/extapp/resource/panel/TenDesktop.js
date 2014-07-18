/**
 * @class App.view.TenDesktop
 * Базовый класс главного окна приложения.
 *
 * @author Ilya Petrushenko
 * @version 1.0
 * @since 20.06.2013
 */

Ext.define('Common.panel.TenDesktop', {

	extend: 'Ext.panel.Panel',
	alias : 'widget.endesktop',

	initComponent: function () {
		var me = this;
		me.windows = new Ext.util.MixedCollection();
		me.tbar = me.toolbar = new Ext.toolbar.Toolbar({height: 30});
		me.bbar = me.taskbar = new Common.toolbar.TenTaskBar();
		me.listeners = {
			afterrender: {
				fn: me.onAfterRender
			}
		};
		me.callParent();
	},

	/**
	 * Метод создания системных окон приложения
	 */
	createSystemWindows: function () {
		var me = this,
			config = {
				desktop: me,
				app    : me.app
			};
		me.msgCount = 0;
		me.repCount = 0;

		// Системные сообщения об ошибках
		me.syswindow = new Common.wins.winSystemMessages(config);
		// Журнал отчётов
		me.repwindow = new Common.wins.winReportMessages(config);

		App.Req.async({
			actionUrl: '/report/default/loadpreviousreports',
			func     : me.onAfterLoadPreviosReports,
			inst     : me
		});
	},

	onAfterLoadPreviosReports: function (data) {
		var me = this, i = 0;
		if (data) {
			for (; i < data.length; i++) {
				me.addReportMessage(data[i]);
			}
		}
	},

	/**
	 * Метод добавления окна в список окон
	 * @param object $window Объект добавляемого окна
	 * @return window
	 */
	addWindow: function (win) {
		var me = this;

		me.windows.add(win.seq, win);
		win.taskButton = me.taskbar.addTaskButton(win);
		win.animateTarget = win.taskButton.el;

		win.on({
			activate  : me.onActivate,
			deactivate: me.onDeactivate,
			minimize  : me.minimizeWindow,
			destroy   : me.onWindowClose,
			scope     : me
		});
		return win;
	},

	minimizeWindow: function (win) {
		win.minimized = true;
		win.hide();
	},

	onWindowClose: function (win) {
		var me = this;
		me.windows.removeAtKey(win.seq);
		me.taskbar.removeTaskButton(win.taskButton);
		return true;
	},

	onActivate: function (win) {
		win.active = true;
		win.minimized = false;
	},

	onDeactivate: function (win) {
		win.active = false;
	},

	onAfterRender: function () {
		var me = this, tlb, st;

		tlb = App.Req.getToolbar({module: 'Encore', func: me.tlbFunc}, me);
		if (tlb) {
			// Удаление старой панели меню
			me.removeDocked(me.toolbar, true);
			delete me.toolbar;
			// Добавление новой панели меню
			tlb.dock = 'top';
			me.addDocked(tlb);
			me.toolbar = tlb;
		}

		// Обновление status
		st = App.Req.sync({
			module    : 'encore',
			controller: 'default',
			action    : 'getuserstatus'
		});
		if (st) {
			me.taskbar.updateStatusText(st.status);
		}

		// Создание системных окон только для приложений. Для менеджера их нет.
		if (!me.isManager) {
			me.createSystemWindows();
		}
	},

	/**
	 * Метод обработки нажатия кнопок.
	 * Идентификатор кнопки передаётся на сервер и по данному идентификатору происходит определение
	 * возможности исполнения действия пользователя, т.е. отображение окна
	 * @param button Ext.Button
	 */
	itemClick: function (button) {
		App.Req.async({
			actionUrl: button.route,
			params   : button.endata,
			func     : Common.EMan.onCreateWindow,
			inst     : Common.EMan
		});
	},

	acShowMessages: function () {
		this.syswindow.show();
	},

	acShowReports: function () {
		this.repwindow.show();
	},

	/**
	 * Метод добавления всплывающих системных сообщений
	 * @param messages mixed Сообщение или массив сообщений
	 * @param type string Тип сообщений (иконка ExtJS)
	 * @param silent bool Выводить всплывающее сообщение или нет
	 */
	addSystemMessages: function (messages, type, silent) {
		var me = this,
			i,
			idtype = type || Ext.Msg.WARNING;

		if (!Ext.isArray(messages)) {
			messages = [messages];
		}

		i = 0;
		me.adding = setInterval(function () {
			if (i < messages.length) {
				me.setMessageCount(me.msgCount + 1);
				me.syswindow.store.add({
					iddate : new Date(),
					message: messages[i],
					isread : 0,
					idtype : idtype
				});

				if (!silent) {
					App.Msg.showTip(messages[i], idtype);
					App.Util.playSound('ring.wav');
				}

				i++;
			}
			else {
				me.syswindow.store.sort('iddate', 'DESC');
				clearInterval(me.adding);
			}
		}, 1000);
	},

	applyStyleToButton: function (btn, highlight) {
		var el = btn.getEl().first().first().first();
		if (highlight) {
			el.setStyle({
				'color'      : 'red',
				'font-weight': 'bold'
			});
		}
		else {
			el.setStyle({
				'color'      : 'black',
				'font-weight': 'normal'
			});
		}
	},

	setMessageCount: function (count) {
		var me = this,
			btn = me.toolbar.i_show_messages;
		me.msgCount = count;
		btn.setText('Сообщения (' + me.msgCount + ')');
		me.applyStyleToButton(btn, count !== 0);
	},

	incMessageCount: function () {
		this.setMessageCount(this.msgCount + 1);
	},

	decMessageCount: function () {
		this.setMessageCount(this.msgCount - 1);
	},

	/**
	 * Метод добавления всплывающих сообщений о формировании отчёта
	 * @param report mixed Сообщение или массив сообщений
	 */
	addReportMessage: function (report) {
		var me = this,
			id = me.repwindow.store.getCount() + 1;
		me.setReportCount(me.repCount + 1);
		me.repwindow.store.add({
			id_report: id,
			iddate   : Ext.Date.parse(report.iddate, 'Y-m-dH:i:s'),
			title    : report.title,
			link     : report.file,
			isread   : report.isread,
			filename : report.filename
		});
		me.repwindow.store.sort('iddate', 'DESC');
		if (report.isread === 0) {
			var msg = Ext.String.format(
				'Отчёт сформирован: {0}<br/><a href="{1}">Загрузить</a>',
				report.title,
				report.file
			);
			App.Msg.showTip(msg, Ext.Msg.INFO);
			App.Util.playSound('ring.wav');
		}
	},

	setReportCount: function (count) {
		var me = this,
			btn = me.toolbar.i_show_reports;
		me.repCount = count;
		btn.setText('Отчёты (' + me.repCount + ')');
	},

	incReportCount: function () {
		this.setReportCount(this.repCount + 1);
	},

	decReportCount: function () {
		this.setReportCount(this.repCount - 1);
	},

	acLogin: function () {
		App.Req.async({
			controller: 'app',
			action    : 'getloginwindow',
			func      : Common.EMan.onCreateWindow,
			inst      : Common.EMan
		});
	},

	acAbout: function () {
		App.Req.async({
			controller: 'app',
			action    : 'getaboutwindow',
			func      : Common.EMan.onCreateWindow,
			inst      : Common.EMan
		});
	},

	acLogout: function () {
		App.Req.sync({
			module    : 'encore',
			controller: 'default',
			action    : 'logout'
		});
	},

	acShowApps: function () {
		App.Req.async({
			actionUrl: '/admin/window/getapplicationswindow',
			func     : Common.EMan.onCreateWindow,
			inst     : Common.EMan
		});
	},

	acSettings: function (cmp) {
		var me = this;

		if (cmp && cmp.cmpClass === 'Ext.window.Window') {
			cmp.acExit();
		}

		App.Req.async({
			actionUrl: '/encore/settings/getsettings',
			func     : Common.EMan.onCreateWindow,
			inst     : Common.EMan,
			extra    : {
				afterlogin: {
					fn   : me.acSettings,
					scope: me
				}
			}
		})
	}

});
