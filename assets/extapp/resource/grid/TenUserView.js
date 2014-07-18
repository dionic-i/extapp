/**
 * @class Common.grid.TenSostavView
 *
 * @author Ilya Petrushenko
 * @version 0.1
 * @since 01.11.2013
 */

Ext.define('Common.grid.TenUserView', {
	extend: 'Common.grid.TenGridView',
	alias : 'widget.enuserview',

	changeButtonsState: function () {
		var me = this;
		me.gridtoolbar.i_change_desc.setDisabled(me.store.getCount() === 0);
		me.gridtoolbar.i_del_user.setDisabled(me.store.getCount() === 0);
		me.gridtoolbar.i_change_pass.setDisabled(me.store.getCount() === 0);
		me.gridtoolbar.i_change_group.setDisabled(me.store.getCount() === 0);
		me.callParent();
	},

	acChangeDesc: function () {
		var me = this;
		if (me.activeRecord) {
			Ext.Msg.prompt('Описание', 'Пожалуйста введите описание', function (btn, text) {
				if (btn == 'ok') {
					App.Req.async({
						actionUrl: '/admin/user/changedescription',
						params   : {
							id         : me.activeRecord.get('ID_USER'),
							description: text
						},
						sync     : false,
						func     : me.acRefresh,
						inst     : me
					});
				}
			}, me, false, me.activeRecord.get('DESCRIPTION'));
		}
	},

	acChangePass: function () {
		var me = this;
		if (me.activeRecord) {
			App.Req.async({
				actionUrl: '/admin/window/changepasswindow',
				params   : {
					id: me.activeRecord.get('ID_USER')
				},
				func     : Common.EMan.onCreateWindow,
				inst     : Common.EMan,
				extra    : {
					aftersuccesssave: {
						fn   : me.onAfterChangePass,
						scope: me
					}
				}
			});
		}
	},

	acAddUser: function () {
		App.Req.async({
			actionUrl: '/admin/window/adduserwindow',
			func     : Common.EMan.onCreateWindow,
			inst     : Common.EMan,
			extra    : {
				beforeexit: {
					fn   : this.acRefresh,
					scope: this
				}
			}
		});
	},

	acDelUser: function () {
		var me = this;
		if (me.activeRecord) {
			App.Req.async({
				actionUrl: '/admin/user/deleteuser',
				params   : {
					id: me.activeRecord.get('ID_USER')
				},
				func     : me.acRefresh,
				inst     : me,
				showTip  : true
			});
		}
	},

	acChangeGroup: function () {
		var me = this;
		if (me.activeRecord) {
			App.Req.async({
				actionUrl: '/admin/window/getuserappgroupswindow',
				params   : {
					id      : me.activeRecord.get('ID_USER'),
					username: me.activeRecord.get('USER_NAME')
				},
				func     : Common.EMan.onCreateWindow,
				inst     : Common.EMan
			});
		}
	},

	acChangeDenied: function () {
	},

	onAfterChangePass: function (win, data) {
		win.acExit();
		App.Msg.Information(data);
	}

});
