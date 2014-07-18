/**
 * @class winUniversal
 * Класс прослойка между стандартным окном и классами окон системы.
 *
 *
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @version 0.1
 * @since 01.01.2013
 */

Ext.define('Common.wins.winMidiWindow', {

	extend: 'Ext.window.Window',

	maximize: function () {
		var me = this;
		if (!me.maximized) {
			me.expand(false);
			if (!me.hasSavedRestore) {
				me.restoreSize = me.getSize();
				me.restorePos = me.getPosition(true);
			}
			if (me.maximizable) {
				me.tools.maximize.hide();
				me.tools.restore.show();
			}
			me.maximized = true;
			me.el.disableShadow();
			if (me.dd) {
				me.dd.disable();
			}
			if (me.collapseTool) {
				me.collapseTool.hide();
			}
			me.el.addCls(Ext.baseCSSPrefix + 'window-maximized');
			me.container.addCls(Ext.baseCSSPrefix + 'window-maximized-ct');
			me.syncMonitorWindowResize();

			var cmpPos = me.getDesktopBodyElement().getXY();
			me.setPosition(cmpPos[0], cmpPos[1]); // 

			me.fitContainer();
			me.fireEvent('maximize', me);
		}
		return me;
	},

	fitContainer: function () {
		var me = this;
		size = me.getDesktopBodyElement().getSize();
		me.setSize(size);
	},

	getDesktopBodyElement: function () {
		var me = this,
			el = me.desktop.getEl(),
			id = me.desktop.getId();
		return el.down('#' + id + '-body');
	}

});
