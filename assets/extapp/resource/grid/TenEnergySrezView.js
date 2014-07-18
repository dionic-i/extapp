/*
 * @class App.view.grid.TenEnergySrezView
 * Класс панели грида для отображения срезов мощности.
 *
 * @author Ilya Petrushenko
 * @version 0.1
 * @since 25.04.2013
 */

Ext.define('Common.grid.TenEnergySrezView', {

	extend: 'Common.grid.TenGridView',
	alias : 'widget.enenergysrezview',

	initComponent: function () {
		var me = this;
		me.bbar = me.getPagingCmp(Ext.StoreMgr.lookup(me.storeId));
		me.callParent();
		me.on('reconfigure', me.onAfterReconfigure, me);
	},

	onAfterReconfigure: function (grid, store, columns, oldStore, the, eOpts) {
		var me = this,
			tb = me.getDockedItems('toolbar[dock="bottom"]');
		me.removeDocked(tb[0], true);
		me.addDocked(me.getPagingCmp(store));
	},

	/**
	 * private
	 * @param store
	 * @returns {Ext.toolbar.Paging}
	 */
	getPagingCmp: function (store) {
		return Ext.create('Ext.toolbar.Paging', {
			dock          : 'bottom',
			store         : store,
			displayInfo   : true,
			displayMsg    : 'Записи {0} - {1} из {2}',
			beforePageText: 'Страница ',
			afterPageText : 'из {0}',
			emptyMsg      : "Записи отсутствуют",
			nextText      : 'Следующая страницы',
			prevText      : 'Предыдущая страница',
			firstText     : 'Первая страница',
			lastText      : 'Последняя страница',
			refreshText   : 'Обновить',
			inputItemWidth: 50
		});
	}

});
