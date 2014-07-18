/**
 * @class winUniversal
 * Класс прослойка между стандартным окном и классами окон системы.
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @version 0.1
 * @since 01.01.2013
 */

Ext.define('Common.wins.winUniversal', {

	extend: 'Common.wins.winMidiWindow',

	constructor: function (cfg) {
		var me = this,
			w = cfg.width || me.width,
			h = cfg.height || me.height;
		cfg = cfg || {};

		// Устанавливаем координаты вывода окна по умолчанию
		if (!me.x && !me.y) {
			me.x = (window.innerWidth - w) / 2;
			me.y = (window.innerHeight - h) / 2;
		}

		me.doCreateSuspended(cfg);
		me.doCreateStores(cfg);

		// Добавление дочерних элементов
		if (cfg.items) {
			me.doCreateItems(cfg.items);
			delete cfg.items;
		}

		me.callParent([cfg]);
	},

	/**
	 * @virtual
	 * Создание отложенных объектов, например tbar, bbar.
	 * @param {object} cfg
	 */
	doCreateSuspended: function (cfg) {
		var me = this, i, obj;
		if (cfg.hasOwnProperty('suspendProps')) {
			for (i = 0; i < cfg.suspendProps.length; i++) {
				obj = Ext.clone(cfg[cfg.suspendProps[i]]);
				delete cfg[cfg.suspendProps[i]];
				cfg[cfg.suspendProps[i]] = App.Req.getToolbar({remote: false, config: obj}, me);
				me[cfg[cfg.suspendProps[i]].itemId] = cfg[cfg.suspendProps[i]];
			}
		}
	},

	/**
	 * @virtual
	 * Метод создания наборов данных.
	 * @param {object} cfg
	 */
	doCreateStores: function (cfg) {
		var i, obj, store;
		if (cfg.hasOwnProperty('storeProps')) {
			for (i = 0; i < cfg.storeProps.length; i++) {
				obj = Ext.clone(cfg.storeProps[i]);
				store = Ext.create(obj.cmpClass, obj);
				if (obj.hasOwnProperty('storeName')) {
					cfg[obj.storeName] = store;
				}
			}
		}
	},

	/**
	 * @virtual
	 * Метод создания дочерних элементов окна. grids, trees, panels.
	 */
	doCreateItems: function (items) {
		var me = this;
		Ext.each(items, function (item) {
			me[item.itemId] = Common.EMan.createCmp(Ext.apply(item, {cmpWin: me}));
		}, this);
		me.items = [];
		me.doItemListeners();
	},

	doItemListeners: Ext.emptyFn,

	acRefresh: Ext.emptyFn,

	destroy: function () {
		var me = this;
		delete me.desktop;
		me.callParent();
	}

});
