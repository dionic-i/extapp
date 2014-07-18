/**
 * @class Common.form.field.TenObjectField
 * Объектное поле. При редактировании вызывается связанный набор данных.
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since 19.03.2013
 */

Ext.define('Common.form.field.TenObjectField', {

	extend: 'Ext.form.field.Trigger',
	alias : 'widget.enobjectfield',

	initComponent: function () {
		var me = this;
		me.callParent();
		me.addEvents('afterrefclick');
	},

	onTriggerClick: function () {
		var me = this;
		me.fireEvent('afterrefclick', me);
	}

});
 
