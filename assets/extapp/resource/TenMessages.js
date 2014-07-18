/**
 * @class App.widenings.TSysMessages
 * Класс для вывода сообщений об ошибках, информации и предупреждения в приложении.
 *
 * @author Ilya Petrushenko
 * @version 1.0
 * @since 20.06.2013
 */

Ext.define('Common.TenMessages', {

		alternateClassName: 'App.Msg',

		getBox: function (options) {
			t = new Ext.Template([
				'<div class="msg">',
				'<h3 class="{h3class}">{h3title}</h3>',
				'<div class="msg-close-icon-div"></div>',
				'<div class="clear-both"></div>',
				'<p>{message}</p>',
				'</div>'
			]);
			t.compile();
			return t.apply(options);
		},

		Error: function (msg) {
			Ext.Msg.show({
				title  : 'Ошибка приложения',
				msg    : msg,
				width  : 350,
				buttons: Ext.Msg.OK,
				icon   : Ext.Msg.ERROR
			});
		},

		Information: function (msg) {
			Ext.Msg.show({
				title  : 'Информация',
				msg    : msg,
				width  : 350,
				buttons: Ext.Msg.OK,
				icon   : Ext.Msg.INFO
			});
		},

		Warning: function (msg) {
			Ext.Msg.show({
				title  : 'Предупреждение',
				msg    : msg,
				width  : 350,
				buttons: Ext.Msg.OK,
				icon   : Ext.Msg.WARNING
			});
		},

		/**
		 * Метод вывода всплывающего сообщения об ошибке или информации.
		 * @param msg string Сообщение
		 * @param icon string Название иконки всплывающей подсказки
		 *
		 */
		showTip: function (msg, icon) {
			var me = this, h3title, m;

			if (icon === Ext.Msg.WARNING) {
				h3title = 'Предупреждение';
			}
			else if (icon === Ext.Msg.ERROR) {
				h3title = 'Ошибка';
			}
			else if (icon === Ext.Msg.INFO) {
				h3title = 'Информация';
			}
			else {
				h3title = 'Сообщение';
			}

			var options = {
				h3title: h3title,
				h3class: icon,
				message: msg
			};

			// Общий div сообщений
			if (!me.msgCt) {
				me.msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-div'}, true);
			}

			m = Ext.DomHelper.insertFirst(me.msgCt, me.getBox(options), true);

			// Привязываем событие закрытия по кнопке
			m.first('.msg-close-icon-div').on('click', function () {
				this.hide();
				this.remove();
			}, m);

			m.hide();
			m.slideIn('r').ghost('r', {
				delay : 20000,
				remove: true
			});
		}

	}, function () {
		Common.TSysMessages = App.Msg = new this();
	}
);

