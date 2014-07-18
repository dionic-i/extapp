/**
 * @class winRefUniversal
 * Класс универсального окна для отображения справочника
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @version 0.1
 * @since 22.02.2013
 */

Ext.define('Common.wins.winRefUniversal', {

	extend: 'Common.wins.winObservable',
	alias : 'widget.winrefuniversal',

	initComponent: function () {
		var me = this;
		me.callParent();
		me.on('show', me.acRefresh, me, {single: true});
		me.dataset.on('load', me.gridview.onAfterRecordsLoad, me.gridview, {single: true});
		me.gridview.on({
			select         : me.gridview.onAfterSelectRow,
			selectionchange: me.gridview.onAfterSelectionChange,
			scope          : me.gridview
		});
	},

	doCreateItems: function (items) {
		var me = this;
		me.callParent([items]);
		me.items.push(me.gridview);
	}

});
