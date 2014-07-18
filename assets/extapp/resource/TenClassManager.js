/**
 * @class Common.TenClassManager
 *
 * @author Ilya Petrushenko
 * @version 0.1
 * @since 20.06.2013
 */

Ext.define('Common.TenClassManager', {

		alternateClassName: 'Common.EMan',

		/**
		 * Метод создания компонетов ExtJs
		 * @return ExtComponent
		 */
		createCmp: function (config) {
			var cmp;
			if (config.hasOwnProperty('xtype'))
				cmp = Ext.create('widget.' + config.xtype, config);
			else if (config.hasOwnProperty('cmpClass'))
				cmp = Ext.create(config.cmpClass, config);
			else
				Ext.Error.raise('Error to find stype param on EMan.createCmp');
			return cmp;
		},

		initApplication: function (app) {
			var me = this,
				cfg;

			me.app = app;

			cfg = App.Req.sync({
				controller: 'app',
				action    : 'getdesktop'
			});
			cfg.app = app;
			cfg.xtype = 'endesktop';

			app.desktop = me.createCmp(cfg);
			me.desktop = app.desktop;

			App.Util.homeUrl = app.desktop.homeUrl;

			Ext.create('Ext.container.Viewport', {
				layout: 'fit',
				items : [app.desktop]
			});

			// Изменение настроек quickTips
			Ext.apply(Ext.tip.QuickTipManager.getQuickTip(), {
				showDelay: 50
			});
		},

		/**
		 * Метод обработчик ответа сервера по созданию окон приложения.
		 * @param data object Конфигурация окна.
		 * @param listeners array Массив событий, которые необходимо привязать к окну
		 *
		 * @return Ext.window.Window
		 */
		onCreateWindow: function (data, listeners) {
			var me = this,
				win;

			Ext.apply(data, {
				desktop: me.desktop,
				app    : me.app
			});

			// Создание моделей данных
			me.doCreateModels(data);

			// Создание окна
			win = me.createCmp(data);
			if (win && !data.modal) {
				me.desktop.addWindow(win);
			}

			// Добавление событий к окну и к его компонентам
			if (listeners) {
				for (var property in listeners) {
					if (property === 'items') {
						// События компонентов окна
						var items = listeners[property];
						for (var i = 0; i < items.length; i++) {
							var object = items[i];
							if (win.hasOwnProperty(object.name)) {
								var events = object.events;
								for (var event in events) {
									win[object.name].on(event, events[event].fn, events[event].scope);
								}
							}
							else {
								Ext.Error.raise('Component ' + object.name + ' not in window.');
							}
						}
					}
					else {
						// События окна
						win.on(property, listeners[property].fn, listeners[property].scope);
					}
				}
			}
			return win;
		},

		doCreateModels: function (data) {
			var i = 0, j;
			if (data.hasOwnProperty('modelProps')) {
				for (; i < data.modelProps.length; i++) {
					Ext.define(data.modelProps[i].modelClass, data.modelProps[i]);
				}
				delete data.modelProps;
			}
		}

	}, function () {
		Common.TenClassManager = Common.EMan = new this();
	}
);
