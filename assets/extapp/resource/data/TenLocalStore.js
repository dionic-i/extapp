/**
 * @class App.data.TenStore
 * Класс локального набора данных.
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @version 0.1
 * @since 13.06.2013
 */

Ext.define('Common.data.TenLocalStore', {
	extend: 'Ext.data.ArrayStore',

	constructor: function (config) {
		var me = this;

		if (!config.fields) {
			me.model = me.getModelByUid(config);
		}

		me.callParent([config]);
		me.loadLocalData();
		me.on('load', me.onAfterLoad, me);
	},

	getModelByUid: function (config) {
		if (Ext.ModelManager.isRegistered(config.uid)) {
			return Ext.ModelManager.getModel(config.uid);
		}
		else {
			Ext.Error.raise('Error: dataset model not defined.');
			return false;
		}
	},

	onAfterLoad: function () {
		this.loadLocalData();
	},

	loadLocalData: function (data, append) {
		this.loadData(this.localData);
	}

});
