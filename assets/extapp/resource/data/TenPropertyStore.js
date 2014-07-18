/**
 * @calss PropertyStore с перекрытым методом getReader.
 * Добавлена поддержка полей с null значениями.
 *
 * @author Ilya Petrushenko
 * @version 1.0
 * @created 18.03.2013
 */

Ext.define('App.data.TenPropertyStore', {

	extend   : 'Ext.grid.property.Store',

	// Return a singleton, customized Reader object which reads Ext.grid.property.Property records from an object.
	getReader: function () {

		if (!this.reader) {
			this.reader = Ext.create('Ext.data.reader.Reader', {
				model          : Ext.grid.property.Property,
				buildExtractors: Ext.emptyFn,
				read           : function (dataObject) {
					return this.readRecords(dataObject);
				},
				readRecords    : function (dataObject) {
					var val,
						propName,
						result = {
							records: [],
							success: true
						};
					for (propName in dataObject) {
						if (dataObject.hasOwnProperty(propName)) {
							val = dataObject[propName];
							if (this.isEditableValue(val)) {
								result.records.push(new Ext.grid.property.Property({
									name : propName,
									value: val
								}, propName));
							}
						}
					}
					result.total = result.count = result.records.length;
					return Ext.create('Ext.data.ResultSet', result);
				},

				// private
				isEditableValue: function (val) {
					return Ext.isPrimitive(val) || Ext.isDate(val) || (val == null);
				}
			});
		}
		return this.reader;
	}

});