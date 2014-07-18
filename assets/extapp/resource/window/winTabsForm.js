/**
 * @class Common.wins.winTabsForm
 * Класс окна для отображения различных форм.
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since 06.02.2014
 */

Ext.define('Common.wins.winTabsForm', {
	extend: 'Common.wins.winUniversal',
	alias : 'widget.wintabsform',

	initComponent: function () {
		var me = this;

		if (me.useTabs) {
			me.items = [
				{
					xtype    : 'tabpanel',
					margin   : '5px',
					itemId   : 'winTabs',
					items    : me.getFormItems(),
					listeners: {
						beforetabchange: {
							fn   : me.onBeforeTabChange,
							scope: me
						}
					}
				}
			];
		}
		else {
			me.items = me.getFormItems();
		}

		me.addEvents('beforeexit');
		me.addEvents('aftersuccesssave');
		me.callParent();
	},

	getFormItems: function () {
		var me = this,
			i = 0,
			result = [],
			form;

		for (; i < me.formNames.length; i++) {
			if (me.hasOwnProperty(me.formNames[i])) {
				form = me[me.formNames[i]];
				form.on('validitychange', me.onFormValidityChange, me);
				result.push(form);
			}
		}

		return result;
	},

	onBeforeTabChange: function (tabPanel, newCard, oldCard, eOpts) {
		if (oldCard.isValid() === false) {
			App.Msg.Warning('Не все поля формы заполнены правильно.');
			return false;
		}
		else {
			return true;
		}
	},

	onFormValidityChange: function (form, valid, eOpts) {
		var me = this,
			i = 0;

		if (valid) {
			for (; i < me.formNames.length; i++) {
				if (me.hasOwnProperty(me.formNames[i])) {
					form = me[me.formNames[i]];
					if (form.isValid() === false) {
						me.wintoolbar.i_save.setDisabled(true);
						return false;
					}
				}
			}
			me.wintoolbar.i_save.setDisabled(false);
		}
		else {
			me.wintoolbar.i_save.setDisabled(true);
		}
	},

	acSave: function () {
		var me = this,
			data = {},
			i = 0;

		for (; i < me.formNames.length; i++) {
			if (me.hasOwnProperty(me.formNames[i])) {
				form = me[me.formNames[i]];
				Ext.apply(data, form.getForm().getValues());
			}
		}

		App.Req.async({
			actionUrl: me.saveUrl,
			params   : data,
			func     : me.onAfterSuccessSave,
			inst     : me
		});
	},

	onAfterSuccessSave: function (data) {
		var me = this;
		if (me.closeAfterSuccessSave) {
			me.acExit();
		}
		else {
			me.fireEvent('aftersuccesssave', me, data);
		}
	},

	acExit: function () {
		var me = this;
		me.fireEvent('beforeexit', me);
		me.destroy();
	},

	destroy: function () {
		var me = this,
			i = 0;
		for (; i < me.formNames.length; i++) {
			if (me.hasOwnProperty(me.formNames[i])) {
				delete me[me.formNames[i]];
			}
		}
		delete me.formNames;
		me.callParent();
	}

});
