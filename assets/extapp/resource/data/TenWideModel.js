/**
 * @class TenWideModel
 *
 * @author Ilya Petrushenko
 * @version 0.1
 * @since 23.04.2013
 */

Ext.define('Common.data.TenWideModel', {
	extend: 'Ext.data.Model',

	/**
	 * Метод установки записи фантомной, т.е. которой нет на сервере
	 */
	setCreated: function () {
		var me = this;
		me.phantom = true;
		me.internalId = me.getId();
		me.id = me.modelName + '-' + me.internalId;
	},

	/**
	 * Метод возвращения записи в виде объекта
	 * @return object
	 */
	getLikeObject: function () {
		var me = this,
			result = {},
			dt, val;

		me.fields.each(function (item, index, len) {
			// Непонятный внутренний id, который нам не нужен при обновлениях записей
			if (item.name === 'id') {
				return;
			}

			if (item.type.type === 'date') {
				val = me.get(item.name);
				dt = Ext.Date.format(val, 'Y-m-d') + ' ' + Ext.Date.format(val, 'H:i:s');
				result[item.name] = dt;
			}
			else {
				result[item.name] = me.get(item.name);
			}
		}, this);

		return result;
	}

});
