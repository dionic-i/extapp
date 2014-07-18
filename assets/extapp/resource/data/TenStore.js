/**
 * @class App.data.TenStore
 *
 * @author Ilya Petrushenko
 * @version 1.0
 * @since 23.04.2013
 */

Ext.define('Common.data.TenStore', {

	extend: 'Ext.data.Store',

	/**
	 * Название модели данных.
	 * @var string
	 */
	uid: '',

	/**
	 * Уникальный идентификатор набора данных
	 * @var string
	 */
	storeId: '',

	/**
	 * Список полей, значения которых не надо добавлять при сохранении записей в updateRecords
	 * @var array
	 */
	excludeFields: [],

	constructor: function (config) {
		var me = this;

		// Если у store есть свойство fields, то модель создается сама, в противном случае
		// придется ее найти среди созданных моделей
		if (!config.fields) {
			me.model = me.getModelByUid(config);
		}

		// Массивы добавленных, обновлённых и удалённых записей
		me.newRecords = [];
		me.updateRecords = [];
		me.deleteRecords = [];

		me.callParent([config]);
		me.on('beforesync', me.onBeforeSync, me);
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

	/**
	 * Метод получения модели данных
	 * @return Model
	 */
	getModel: function () {
		return Ext.ModelManager.getModel(this.uid);
	},

	getIsChanged: function () {
		var me = this,
			created = me.getNewRecords(),
			deleted = me.getRemovedRecords(),
			updated = me.getUpdatedRecords();
		return (created.length > 0 || deleted.length > 0 || updated.length > 0);
	},

	add: function (record) {
		var me = this, sr = {}, rec;

		// Метод, который мы применяем в веб-оболочке сборщика не работает,т.к.
		// здесь есть установка поля idProperty. А когда мы его устанавливаем, то
		// запись становится не фантомной и попадает в обновляемые, а не в созданные.
		// Добавили метод setCreated, который решает данную проблему.

		// Обнуляем запись для того чтобы потом выставить значения и сделать её dirty
		for (var key in record) {
			sr[key] = record[key];
			record[key] = '';
		}
		rec = me.callParent([record]);

		for (key in sr) {
			rec[0].set(key, sr[key]);
		}

		rec[0].setCreated();
		return rec;
	},

	/**
	 * Обновление значений записи
	 * @param record EnWideModel
	 * @param values EnWideModel
	 */
	doUpdate: function (record, values) {
		record.set(values);
	},

	undo: function () {
		var me = this,
			created = me.getNewRecords(),
			deleted = me.getRemovedRecords(),
			updated = me.getUpdatedRecords(),
			i;

		// Удаление новых записей
		if (created.length > 0) {
			for (i = 0; i < created.length; i++) {
				me.remove(created[i]);
			}
		}

		// Возвращение значений обновлённых записей
		if (updated.length > 0) {
			for (i = 0; i < updated.length; i++) {
				updated[i].reject();
			}
		}

		// Возврат удалённых записей
		if (deleted.length > 0) {
			for (i = 0; i < deleted.length; i++) {
				var rec = me.insert(deleted[i].removedFrom, deleted[i]);
				rec.join(me);
			}
			me.removed = [];
		}

		me.fireEvent('datachanged', me);
	},

	/**
	 * Метод-обработчик события перед синхронизацией записей с сервером
	 *
	 */
	onBeforeSync: function (records, options) {
		var me = this,
			proxy = me.getProxy(),
			updated = me.getUpdatedRecords(),
			deleted = me.getRemovedRecords(),
			record;

		// Если существуют обновлённые записи, то добавляем их первоначальный вид.
		// Так как при формировании XML на сервер приложений нужны прошлые значения полей записи
		if (updated.length > 0) {
			if (proxy.existParam('updateRecords'))
				proxy.setParam('updateRecords', me.getLastUpdatedValues(updated));
			else
				proxy.addParam('updateRecords', me.getLastUpdatedValues(updated));
		}
		else {
			proxy.delParam('updateRecords');
		}

		// Значения удалённых записей
		if (deleted.length > 0) {

			var deletedToServer = [];
			for (var i = 0; i < deleted.length; i++) {
				record = deleted[i].getLikeObject();
				// Удаление ненужных полей записи
				for (j = 0; j < me.excludeFields.length; j++) {
					if (record.hasOwnProperty(me.excludeFields[j])) {
						delete record[me.excludeFields[j]];
					}
				}
				deletedToServer.push(record);
			}

			if (proxy.existParam('destroyRecords'))
				proxy.setParam('destroyRecords', deletedToServer);
			else
				proxy.addParam('destroyRecords', deletedToServer);
		}
		else {
			proxy.delParam('destroyRecords');
		}

		return true;
	},

	/**
	 * @private
	 * Получение массива прошлых значений обновленных записей.
	 * @param records array Обновлённые записи
	 */
	getLastUpdatedValues: function (records) {
		var me = this,
			result = [],
			record,
			changes,
			j;

		for (var i = 0; i < records.length; i++) {
			changes = records[i].modified;
			record = records[i].getLikeObject();

			// Удаление ненужных полей записи
			for (j = 0; j < me.excludeFields.length; j++) {
				if (record.hasOwnProperty(me.excludeFields[j])) {
					delete record[me.excludeFields[j]];
				}
			}

			// Добавление неизменённых значений
			for (var prop in changes) {
				if (record.hasOwnProperty(prop)) {
					record[prop] = changes[prop];
				}
			}
			result.push(record);
		}
		return result;
	},

	destroyStore: function () {
		var me = this;
		delete me.newRecords;
		delete me.updateRecords;
		delete me.deleteRecords;
		me.callParent();
	}

});
