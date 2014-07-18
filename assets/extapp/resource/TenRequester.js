/**
 * @class TRequester (singleton).
 * Предназначен для отправления запроса на сервер посредством singelton Ajax.
 *
 * Алгоритм работы метода Send:
 *
 * Синхронный запрос.
 * Если ответ от сервера без ошибок,
 * то проверяется определена ли функция обратного вызова. Если она определена, то вызывается,
 * в противном случае просто возвращается поле data ответа сервера.
 *
 * Асинхронный запрос.
 * При асинхронном запросе определяются функции успешного и неуспешного завершения запроса.
 * Если они не определены, то вызываются функции по умолчанию.
 *
 * @author Petrushenko Ilya
 * @version 0.1
 * @since 20.06.2013
 */

Ext.define('Common.TenRequester', {

		mixins: {
			observable: 'Ext.util.Observable'
		},

		alternateClassName: 'App.Req',

		constructor: function (config) {
			this.mixins.observable.constructor.apply(this, config);
		},

		/**
		 * @internal
		 * Метод получения url контроллера
		 * @param options object Название контроллера
		 * @return string
		 */
		getUrl: function (options) {
			var url;

			if (options.actionUrl) {
				return options.actionUrl;
			}

			if (options.module) {
				url = '/' + options.module + '/' + options.controller;
			}
			else {
				url = '/' + options.controller;
			}

			if (options.action) {
				url = url + '/' + options.action;
			}

			return url;
		},

		/**
		 * @public
		 * Метод отправления асинхронного запроса серверу.
		 * @param options object Параметры запроса
		 *        @actionUrl Адрес, на который отправляется запрос, если не укзан, то формируется из параметров ниже
		 *
		 *        @module Название модуля
		 *        @controller Название контроллера
		 *        @action Название действия
		 *
		 *        @params Параметры метода контроллера
		 *
		 *        @inst Контекс выполнения функции callback при удачном запросе
		 *        @func Метод, который выполняется при удачном запросе
		 *        @extra Параметры, передаваемые в callback-метод, которые не надо отправлять на сервер
		 */
		async: function (options) {
			var me = this;

			Ext.Ajax.request({
				url   : me.getUrl(options),
				method: 'POST',
				params: {
					data: Ext.encode(options.params || null)
				},

				callback: function (options, success, response) {
					var answer = Ext.decode(response.responseText);
					if (success) {
						if (answer.success) {
							/**
							 * Если запрос вернул положительный результат и свойство options.showTip = true, то выводим не блокирующее сообщение.
							 */
							if (options.showTip) {
								App.Msg.showTip(answer.message, Ext.Msg.INFO);
							}
							Ext.callback(options.func, options.inst, [answer.data, options.extra]);
							return response;
						}
						else {
							App.Msg.showTip(answer.message, Ext.Msg.ERROR);
						}
					}
					else {
						// Редирект на указанный url
						if (answer.data.redirectUrl) {
							App.Msg.Error(answer.message);
							me.doRedirect(answer.data.redirectUrl, answer.data.redirectWait);
							return false;
						}
					}
					return false;
				},

				failure: function (response, options) {
					console.log(response);
				},

				scope  : me,
				async  : true,
				func   : options.func || me.emptyFunc,
				inst   : options.inst || me,
				extra  : options.extra,
				showTip: options.showTip || false
			});
		},

		/**
		 * @public
		 * Метод отправления синхронного запроса серверу.
		 * @param options mixed Параметры запроса
		 *        @controller Название контроллера
		 *        @action Название действия
		 *        @params Параметры метода контроллера
		 * @return object/false
		 */
		sync: function (options) {
			var me = this,
				answer,
				resp;

			resp = Ext.Ajax.request({
				url    : me.getUrl(options),
				method : 'POST',
				params : {
					data: Ext.encode(options.params || null)
				},
				failure: function (response, options) {
					console.log(response);
				},
				scope  : this,
				async  : false
			});

			answer = Ext.decode(resp.responseText);
			if (!answer.success) {

				if (answer.data.redirectUrl) {
					App.Msg.Error(answer.message);
					me.doRedirect(answer.data.redirectUrl, answer.data.redirectWait);
					return false;
				}

				App.Msg.Error(answer.message || 'Критическая ошибка. Обратитесь к разработчику ПО.');
				return false;
			}
			else {
				// При наличии свойства redirectUrl, производим переход
				if (answer.data.redirectUrl) {
					me.doRedirect(answer.data.redirectUrl, answer.data.redirectWait);
					return true;
				}

				if (options.full) {
					return answer;
				}
				else {
					return answer.data;
				}
			}
		},

		/**
		 * Метод получения удалённых методов контроллеров
		 */
		getDirects: function () {
			var me = this,
				moduls, mdl, ctr,
				i, obj = {};

			// Запрос списка модулей с их удалёнными методами
			moduls = me.sync({
				controller: 'app',
				action    : 'getremotemethods'
			});

			// Создание объектов обработки вызова удалённых методов
			if (moduls) {

				for (var m in moduls) {
					mdl = moduls[m];
					for (var c in mdl) {
						ctr = mdl[c];
						obj[c] = {};

						for (i = 0; i < ctr.length; i++) {
							obj[c][ctr[i]] = {
								module    : m,
								controller: c,
								action    : ctr[i],
								exec      : me.directMethod
							};
						}
					}

					me[m] = Ext.clone(obj);
					obj = {};
				}
			}
		},

		/**
		 * Реализация удалённых методов модулей
		 * Контекст выполнения данного метода - объект модуля.
		 * @param options object Параметры выполнения запроса.
		 *        params: Параметры отправляемые на сервер. Зависят от конкретного удалённого метода.
		 *        extra: Параметры передавыемые в callback функцию после выполнения запроса.
		 *                Зависят от конкретнй callback функции.
		 *        sync: true/false Синхронность выполнения метода
		 *        fn: Callback-функция. Обработчик положительного ответа сервера
		 *        scope: Контекст выполнения callback функции
		 * @return mixed
		 */
		directMethod: function (options) {
			var me = this;

			if (options.sync) {
				return App.Req.sync({
					module    : me.module.toLowerCase(),
					controller: me.controller.toLowerCase(),
					action    : me.action.toLowerCase(),
					params    : options.params
				});
			}
			else {
				App.Req.async({
					module    : me.module.toLowerCase(),
					controller: me.controller.toLowerCase(),
					action    : me.action.toLowerCase(),
					params    : options.params,
					func      : options.fn,
					inst      : options.scope,
					extra     : options.extra || false
				});
				return true;
			}
		},

		/**
		 * Метод создания кнопок панелей управления по конфигу с сервера.
		 *
		 * @param options object Параметры запроса на сервер или конфигурационный объект toolbar
		 *        module: Название модуля, который возвращает toolbar (Контроллер Default, метод getToolbar)
		 *        config: Конфигурационный объект toolbar
		 *
		 * @param scope Владелец toolbar для выставления методов обработчиков кнопок
		 *
		 * @return Ext.toolbar.Toolbar
		 */
		getToolbar: function (options, scope) {
			var config;

			if (options.module) {
				Ext.applyIf(options, {
					controller: 'Default',
					func      : 'GetToolbar'
				});

				config = App.Req.sync({
					module    : options.module.toLowerCase(),
					controller: options.controller.toLowerCase(),
					action    : options.func.toLowerCase()
				});
			}
			else {
				config = options.config;
			}

			if (config) {
				Ext.apply(config, {
					xtype: 'entoolbar',
					inst : scope
				});
				return Common.EMan.createCmp(config);
			}
			else {
				return false;
			}
		},

		// @private
		doRedirect: function (url, timeout) {
			if (!timeout) {
				window.location.href = url;
			}
			else {
				setTimeout(function () {
					window.location.href = url;
				}, timeout);
			}
		},

		emptyFunc: function () {
		}

	}, function () {
		Common.TRequester = App.Req = new this();
	}
);
