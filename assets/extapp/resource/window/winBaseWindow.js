/**
 * Description of winBaseWindow.
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 05.03.14 15:27
 */

Ext.define('Common.wins.winBaseWindow', {

	extend: 'Common.wins.winUniversal',
	alias : 'widget.winbase',

	acExit: function () {
		this.destroy();
	}

});
	