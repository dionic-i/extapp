/**
 * @class Common.wins.winTabsForm
 * Окно с настройками системы.
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since 06.02.2014
 */

Ext.define('Common.wins.winSettings', {
	extend: 'Common.wins.winTabsForm',
	alias : 'widget.winsettings',

	initComponent: function () {
		var me = this;
		me.callParent();
		me.on('aftersuccesssave', me.doAfterSave, me);
	},

	acBlock: function () {
		var me = this;
		App.Req.async({actionUrl: '/encore/settings/blocksettings'});
		me.acExit();
	},

	doAfterSave: function (win, data) {
		App.Msg.Information(data.message);
	}

});
