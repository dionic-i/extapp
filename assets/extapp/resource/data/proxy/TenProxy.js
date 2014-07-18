/**
 * @class TenProxy
 *
 * @author Ilya Petrushenko
 * @version 0.1
 * @since 27.06.2013
 */

Ext.define('Common.data.proxy.TenProxy', {

	extend: 'Ext.data.proxy.Ajax',
	alias : 'proxy.enproxy',

	/**
	 * @private
	 * Метод расшифровки параметров
	 */
	decodeParams: function () {
		var extra = Ext.clone(this.extraParams);
		return Ext.decode(extra.data);
	},

	/**
	 * Метод установки значения параметра запроса
	 * @param Ext.MixedCollection params
	 */
	fillParams: function (params) {
	},

	/**
	 * Метод установки значения параметра запроса
	 * @param {string} name Название параметра
	 * @param {string} value Значение параметра
	 */
	setParam: function (name, value) {
		var me = this,
			extra = me.decodeParams();
		if (!extra.hasOwnProperty(name)) {
			Ext.Error.raise('Error to set TenProxy parameter ' + name);
		}
		extra[name] = value;
		me.extraParams.data = Ext.encode(extra);
	},

	/**
	 * Метод добавления параметра запроса. Если параметр существует, то просто переписываем значение.
	 * @param {string} name Название параметра
	 * @param {mixed} value Значение параметра
	 */
	addParam: function (name, value) {
		var me = this,
			extra = me.decodeParams();
		extra[name] = value;
		me.extraParams.data = Ext.encode(extra);
	},

	/**
	 * Метод удаления параметра запроса
	 * @param string name Название параметра
	 */
	delParam: function (name) {
		var me = this,
			extra = me.decodeParams();

		if (extra.hasOwnProperty(name)) {
			delete extra[name];
			me.extraParams.data = Ext.encode(extra);
		}
	},

	/**
	 * Метод очистки параметров
	 */
	clearParams: function () {
		this.extraParams.data = Ext.encode({});
	},

	/**
	 * Метод проверки существования параметра
	 * @param string name Название параметра
	 */
	existParam: function (name) {
		var me = this,
			extra = me.decodeParams();
		return extra.hasOwnProperty(name);
	},

	getExtParams: function () {
		return this.decodeParams();
	},

	getExtParam: function (name) {
		var me = this,
			extra = me.getExtParams();

		if (extra.hasOwnProperty(name))
			return extra[name];
		else
			return false;
	},

	/**
	 * Перекрываем метод для добавления в POST параметры удалённых и обновлённых записей.
	 *
	 * Creates an {@link Ext.data.Request Request} object from {@link Ext.data.Operation Operation}.
	 *
	 * This gets called from doRequest methods in subclasses of Server proxy.
	 * @override
	 *
	 * @param {Ext.data.Operation} operation The operation to execute
	 * @return {Ext.data.Request} The request object
	 */
	buildRequest: function (operation) {
		var me = this,
			params,
			requestData = {};

		if (operation.allowWrite()) {
			if (operation.action === 'destroy') {
				requestData.destroy = me.getExtParam('destroyRecords');
				me.delParam('destroyRecords');
			}
			else if (operation.action === 'update') {
				requestData.update = me.getExtParam('updateRecords');
				me.delParam('updateRecords');
			}
		}

		params = operation.params = Ext.apply({}, operation.params, me.extraParams);

		Ext.applyIf(params, me.getParams(operation));
		if (operation.id !== undefined && params[me.idParam] === undefined) {
			params[me.idParam] = operation.id;
		}

		var request = new Ext.data.Request({
			params   : params,
			action   : operation.action,
			records  : operation.records,
			operation: operation,
			url      : operation.url,
			jsonData : requestData,
			proxy    : me
		});

		request.url = me.buildUrl(request);
		operation.request = request;

		return request;
	}
});
