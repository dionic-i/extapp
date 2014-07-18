/**
 * @class App.func.TenTaskBar
 * Класс для нижней панели приложения.
 *
 * @author Ilya Petrushenko
 * @version 1.0
 * @since 20.06.2013
 */

Ext.define('Common.toolbar.TenTaskBar', {

	extend  : 'Ext.toolbar.Toolbar',
	requires: [
		'Ext.button.Button',
		'Ext.resizer.Splitter',
		'Ext.menu.Menu'
	],
	height  : 34,
	alias   : 'widget.entaskbar',

	initComponent: function () {
		var me = this;

		me.windowBar = new Ext.toolbar.Toolbar({
			height: 30,
			flex  : 1,
			items : ['&#160;'],
			layout: {
				overflowHandler: 'Scroller'
			}
		});

		me.infoBar = new Ext.toolbar.Toolbar({
			width       : 350,
			height      : 30,
			items       : [
				{
					xtype: 'tbtext',
					text : 'Соединение: отсутствует'
				}
			],
			setInfoTitle: function (title) {
				this.items.getAt(0).setText(title);
			}
		});

		me.items = [
			me.windowBar,
			'-',
			me.infoBar
		];

		me.callParent();
	},

	updateStatusText: function (title) {
		this.infoBar.setInfoTitle(title);
	},

	onWindowBtnClick: function (btn) {
		var win = btn.win;
		if (win.minimized || win.hidden) {
			win.show();
		} else if (win.active) {
			win.minimize();
		} else {
			win.toFront();
		}
	},

	addTaskButton: function (win) {
		var config = {
			iconCls     : win.iconCls,
			enableToggle: true,
			toggleGroup : 'all',
			width       : 80,
			height      : 25,
			text        : Ext.util.Format.ellipsis(win.title, 20),
			tooltip: {
				text: win.title,
				dismissDelay: 1000
			},
			listeners   : {
				click: this.onWindowBtnClick,
				scope: this
			},
			win         : win
		}, cmp;

		cmp = this.windowBar.add(config);
		cmp.toggle(true);
		return cmp;
	},

	removeTaskButton: function (btn) {
		var me = this,
			found;
		me.windowBar.items.each(function (item) {
			if (item === btn) {
				found = item;
			}
			return !found;
		});
		if (found) {
			me.windowBar.remove(found);
		}
		return found;
	},

	setActiveButton: function (btn) {
		var me = this;
		if (btn) {
			btn.toggle(true);
		}
		else {
			me.windowBar.items.each(function (item) {
				if (item.isButton) {
					item.toggle(false);
				}
			});
		}
	}

});


