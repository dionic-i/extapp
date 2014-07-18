/**
 * Description of TenBaseForm.
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 21.02.14 10:16
 */

Ext.define('Common.form.TenBaseForm', {
	extend: 'Ext.form.Panel',
	alias : 'widget.enbaseform',

	initItems: function () {
		var me = this,
			i = 0,
			item,
			handler;

		for (; i < me.items.length; i++) {
			item = me.items[i];
			if (item.hasOwnProperty('handler')) {
				item.handler = me[item.handler];
				item.scope = me;
			}
		}

		me.callParent();
	}

});
