/**
 * @class Common.TenToolbar.
 * Расширение стандартного toolbar для вохможности ображения к его кнопкам как к свойствам по itemId.
 * Максимальное вложение на 2 уровня. Т.е. обращение к кнопкам menu тоже возможно. Однако необходимо
 * соблюдать уникальность идентификаторов itemID в пределах всего toolbar.
 *
 * @author Ilya Petrushenko
 * @version 1.0
 * @since 20.06.2013
 */

Ext.define('Common.toolbar.TenToolbar', {

	extend  : 'Ext.toolbar.Toolbar',
	alias   : 'widget.entoolbar',

	// @private Название кнопок itemId
	btnnames: [],

	initComponent: function () {
		var me = this;
		me.createItems();
		me.callParent();
	},

	// @private
	createItems  : function () {
		var me = this,
			items = me.items,
			action,
			scope = me.inst;

		if (!items) return;

		for (var i = 0; i <= items.length - 1; i++) {

			if (items[i].hasOwnProperty('menu')) {
				for (var j = 0; j < items[i].menu.items.length; j++) {
					action = Ext.create(items[i].menu.items[j].cmpClass, Ext.apply(
						items[i].menu.items[j], {
							handler: scope[items[i].menu.items[j].handler],
							scope  : scope
						}
					));
					items[i].menu.items[j] = action;
					if (items[i].menu.items[j].hasOwnProperty('itemId')) {
						me.btnnames.push(items[i].menu.items[j].itemId);
						me[items[i].menu.items[j].itemId] = action;
					}
				}
			}
			else {

				if (items[i].enableToggle) {
					if (items[i].toggleHandler) {
						items[i].toggleHandler = scope[items[i].toggleHandler];
						items[i].scope = scope;
					}
				}
				else {
					if (items[i].handler) {
						items[i].handler = scope[items[i].handler];
						items[i].scope = scope;
					}
				}

				action = Ext.create(items[i].cmpClass, items[i]);

				items[i] = action;

				if (items[i].hasOwnProperty('itemId')) {
					me.btnnames.push(items[i].itemId);
					me[items[i].itemId] = action;
				}
			}
		}

		me.items = items;
	},

	destroy: function () {
		var me = this, i = 0;
		delete me.options;
		// Удаление кнопок управления
		for (; i < me.btnnames.length; i++) {
			if (me.hasOwnProperty(me.btnnames[i])) {
				delete me[me.btnnames[i]];
			}
		}
		me.callParent();
	}

});