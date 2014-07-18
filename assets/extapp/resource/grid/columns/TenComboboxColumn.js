/**
 * Description of TenComboboxColumn.
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 27.05.14 15:08
 */

Ext.define('Common.grid.columns.TenComboboxColumn', {
	extend      : 'Ext.grid.column.Column',
	alias       : 'widget.encombocolumn',
	valueField  : 'ID',
	displayField: 'DESC',
	storeId     : false,

	initComponent: function () {
		var me = this;
		if (me.storeId) {
			me.localStore = Ext.data.StoreManager.lookup(me.storeId);
		}
		me.callParent();
	},

	renderer: function (value, meta) {
		var me = meta.column,
			index,
			record;

		if (me.localStore) {
			index = me.localStore.find(me.valueField, value);
			record = me.localStore.getAt(index);
			if (record) {
				return record.get(me.displayField);
			}
			else {
				return null;
			}
		}
		else {
			return value;
		}
	}

});
	