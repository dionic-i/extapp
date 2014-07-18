/**
 * Description of TenCheckboxColumn.
 *
 * @author: Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @since: 27.05.14 9:59
 */

Ext.define('Common.grid.columns.TenCheckboxColumn', {

	extend: 'Ext.grid.column.CheckColumn',
	alias : 'widget.encheckcolumn',

	checkValue  : 1,
	uncheckValue: 0,

	/**
	 * @private
	 * Process and refire events routed from the GridView's processEvent method.
	 */
	processEvent: function (type, view, cell, recordIndex, cellIndex, e, record, row) {
		var me = this,
			editor = me.getEditor(),
			grid = me.ownerCt.grid;

		if (type === 'dblclick' && editor) {
			grid.acEditRecord();
		}

		if ((type === 'dblclick' || type === 'click') && !me.stopSelection) {

			view.selModel.selectByPosition({
				row   : recordIndex,
				column: cellIndex
			});

			me.callParent(arguments);
		}

		return false;
	},

	// Note: class names are not placed on the prototype bc renderer scope
	// is not in the header.
	renderer    : function (value, meta) {
		var cssPrefix = Ext.baseCSSPrefix,
			cls = [cssPrefix + 'grid-checkcolumn'];

		if (this.disabled) {
			meta.tdCls += ' ' + this.disabledCls;
		}
		if (value == this.checkValue) {
			cls.push(cssPrefix + 'grid-checkcolumn-checked');
		}

		return '<img class="' + cls.join(' ') + '" src="' + Ext.BLANK_IMAGE_URL + '"/>';
	}

});
	