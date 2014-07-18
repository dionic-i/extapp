/**
 * @class Common.wins.winLogin
 * Класс окна для логинизации в системе.
 *
 * @author Ilya Petrushenko
 * @since 01.01.2013
 */

Ext.define('Common.wins.winLogin', {

	extend: 'Ext.window.Window',
	alias : 'widget.winlogin',

	initComponent: function () {
		var me = this;
		me.createForm();
		if (!me.x && !me.y) {
			me.x = (window.innerWidth - me.width) / 2;
			me.y = (window.innerHeight - me.height) / 2;
		}

		me.addEvents('afterlogin');
		me.callParent();
	},

	createForm: function () {
		var me = this;

		me.form = Ext.create('Ext.form.Panel', {
			baseCls      : 'blue-panel',
			border       : false,
			bodyPadding  : 5,
			fieldDefaults: {
				labelWidth: 100,
				anchor    : '100%',
				allowBlank: false,
				vtype     : 'alphanum'
			},
			defaultType  : 'textfield',
			items        : [
				{
					fieldLabel: 'Пользователь',
					name      : 'username',
					value     : ''
				},
				{
					fieldLabel: 'Пароль',
					inputType : 'password',
					name      : 'password',
					value     : ''
				}
			],

			buttons: [
				{
					text   : 'ОК',
					handler: me.acLogin,
					scope  : me
				},
				{
					text   : 'Отмена',
					handler: me.close,
					scope  : me
				}
			]
		});

		me.items = [me.form];
	},

	acLogin: function () {
		var me = this,
			form = me.form.getForm();
		if (form.isValid()) {
			var data = App.Req.sync({
				actionUrl: me.loginUrl,
				params   : me.form.getForm().getValues()
			});

			if (data) {
				me.fireEvent('afterlogin', me, data);
			}
		}
	},

	acExit: function () {
		this.destroy();
	},

	destroy: function () {
		this.form.destroy();
		delete this.form;
		this.callParent();
	}

});
