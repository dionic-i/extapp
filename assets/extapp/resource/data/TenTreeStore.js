/**
 * Created with JetBrains PhpStorm.
 * User: prg03
 * Date: 16.07.13
 * Time: 13:10
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Common.data.TenTreeStore', {
	extend: 'Ext.data.TreeStore',

	constructor: function (config) {
		var me = this;

		// Если у store есть свойство fields, то модель создается сама, в противном случае
		// придется ее найти среди созданных моделей
		if (!config.fields) {
			me.model = me.getModelByUid(config);
		}

		me.callParent([config]);

		me.firstLoad = true;
		//me.on('beforeload', me.onBeforeLoad, me);
	},

	/**
	 * Метод создания модели данных для набора
	 * @return Model
	 */
	getModelByUid: function (config) {
		if (Ext.ModelManager.isRegistered(config.uid)) {
			return Ext.ModelManager.getModel(config.uid);
		}
		else {
			Ext.Error.raise('Error: dataset model not defined.');
			return false;
		}
	},

	onBeforeLoad: function () {
		//  Необходимое событие, т.к. store загружает данные не смотря на autoLoad = false
		return !this.firstLoad;
	}

});
