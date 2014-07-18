/**
 * @class Common.TenUtil
 * Класс впомогательных методов и функций приложения.
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @version 0.1
 * @since 20.06.2013
 */

Ext.define('Common.TenUtil', {

		alternateClassName: 'App.Util',

		/**
		 * Метод преобразования первого символа строки в верхний регистр
		 * @return string
		 */
		ucFirst: function (value) {
			var f = value.charAt(0),
				v = value.substr(1, value.length - 1);
			return f.toUpperCase().concat(v);
		},

		lcFirst: function (value) {
			var f = value.charAt(0),
				v = value.substr(1, value.length - 1);
			return f.toLowerCase().concat(v);
		},

		/**
		 * Метод воспроизведения звука
		 */
		playSound: function (sound) {
			var me = this,
				snd = new Audio(me.homeUrl + '/res/sounds/' + sound);
			snd.preload = 'auto';
			snd.play();
			snd = null;
		}
	},
	function () {
		Common.TenUtil = App.Util = new this();
	}
);
