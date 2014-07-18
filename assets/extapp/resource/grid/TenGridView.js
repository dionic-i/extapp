/**
 * @class TenGridView
 *
 * @author Ilya Petrushenko
 * @version 0.1
 * @since 01.01.2013
 */

Ext.define('Common.grid.TenGridView', {
	extend: 'Ext.grid.Panel',
	alias : 'widget.engridview',
	mixins: {
		tlbfactory: 'Common.toolbar.TenToolbarFactory'
	},

	constructor    : function (config) {
		var me = this;
		config = me.initGridPlugins(config);
		me.callParent([config]);
	},

	// @virtual
	// @protected
	initGridPlugins: function (config) {
		var me = this, i = 0;
		if (config.plugins) {
			for (; i < config.plugins; i++) {
				if (config.plugins[i].ptype === 'rowexpander') {
					config.plugins[i].rowBodyTpl = new Ext.XTemplate(config.plugins[i].rowBodyTpl);
				}
			}
		}
		return config;
	},

	initComponent: function () {
		var me = this;
		me.mixins.tlbfactory.createSuspended(me);

		me.addEvents(
			'afterexcelreport', // Событие получения ссылки на excel документ
			'changerecords',    // Событие изменения записей (для блокировки кнопок)
			'selectrecords',    // Событие выбора записи в связанном наборе
			'rollback',         // Событие кнопки отката изменений
			'aftersync',        // Событие после сохранения записей в store
			'aftersuccesssync', // Событие после успешного сохранения записей в store
			'afterfailuresync'  // Событие после ошибки сохранения записей в store
		);

		me.store = Ext.StoreMgr.lookup(me.storeId);
		me.store.on({
			datachanged: me.onDataChanged,
			update     : me.onDataChanged,
			clear      : me.onDataChanged,
			add        : me.onDataChanged,
			scope      : me
		});

		me.callParent();

		me.on('beforeedit', me.onBeforeEdit, me);
		me.on('canceledit', me.onCancelEdit, me);
		if (me.selectConstrain) {
			me.on('beforeselect', me.doBeforeSelectRecords, me);
		}

		// Свойство сохранялись записи или нет.
		// Иногда требуется для проверки и последующего обновления других компонентов.
		me.doneSync = false;
		me.doApplyQuickSearch();
	},

	/**
	 * @private
	 * Метод настройки поля для быстрого поиска записей и кнопки сброса поиска
	 */
	doApplyQuickSearch: function () {
		var me = this;

		if (me.quickSearch) {
			me.gridtoolbar.add('->');

			me.gridtoolbar.add({
				xtype: 'tbtext',
				text : 'Поиск:'
			});

			me.gridtoolbar.add({
				xtype : 'textfield',
				itemId: 'i_search',
				width : 170,
				value : '',
				listeners: {
					change: {
						fn: me.onChangeSearch,
						scope: me
					}
				}
			});

			me.gridtoolbar.add({
				iconCls: 'i_find',
				itemId : 'i_down_search',
				tooltip: 'Поиск вниз',
				disabled: true,
				handler: me.acSearchDown,
				scope  : me
			});

			me.gridtoolbar.add({
				iconCls: 'i_clear_filter',
				itemId : 'i_clear_search',
				tooltip: 'Очистить поиск',
				disabled: true,
				handler: me.acClearSearch,
				scope  : me
			});
		}
	},

	/**
	 * @virtual
	 * Метод для изменения состояния кнопок на тулбаре
	 */
	changeButtonsState: function () {
		var me = this,
			store = me.getStore();

		if (me.gridtoolbar.i_delete) {
			me.gridtoolbar.i_delete.setDisabled(store.getCount() === 0);
		}

		if (me.gridtoolbar.i_delete_all) {
			me.gridtoolbar.i_delete_all.setDisabled(store.getCount() === 0);
		}

		if (me.gridtoolbar.i_add_copy) {
			me.gridtoolbar.i_add_copy.setDisabled(store.getCount() === 0);
		}

		if (me.gridtoolbar.i_undo) {
			me.gridtoolbar.i_undo.setDisabled(!store.getIsChanged());
		}

		if (me.gridtoolbar.i_save) {
			me.gridtoolbar.i_save.setDisabled(!store.getIsChanged());
		}

		if (me.gridtoolbar.i_excel) {
			me.gridtoolbar.i_excel.setDisabled(store.getCount() === 0);
		}
	},

	doBeforeSelectRecords: function () {
		var me = this,
			select = me.getSelectionModel().getSelection();

		if (Ext.isArray(select) && select.length > 0 && select.length >= me.selectConstrain) {
			App.Msg.showTip('Ограничение выбора записей: ' + me.selectConstrain, Ext.Msg.INFO);
			return false;
		}
		else {
			return true;
		}
	},

	onAfterSelectRow: function (sm, record) {
		this.activeRecord = record;
		this.changeButtonsState();
	},

	onAfterSelectionChange: function (sm, records) {
		this.activeRecord = records[0];
		this.changeButtonsState();
	},

	onAfterRecordsLoad: function (store, records, success) {
		var me = this,
			sel = me.getSelectionModel(),
			start = me.startRecord > 0 ? me.startRecord : 0;
		if (success && store.getCount() > 0) {
			sel.select(start);
		}
	},

	onAfterGetReport: function (data) {
		this.fireEvent('afterexcelreport', this, data);
	},

	onDataChanged: function (store) {
		var me = this;
		if (me.gridtoolbar) {
			if (Ext.isFunction(store.getIsChanged)) {
				me.fireEvent('changerecords', store.getIsChanged());
			}
			else {
				me.fireEvent('changerecords', false);
			}
			me.changeButtonsState();
		}
	},

	/**
	 * Установка обработчиков событий клика по объектным полям.
	 * @param editor TenObjectField
	 */
	onBeforeEdit: function (editor) {
		var me = this,
			edt = editor.editor;
		edt.items.each(function (item) {
			if (item instanceof Common.form.field.TenObjectField) {
				item.on('afterrefclick', me.onAfterRefClick, me);
			}
		}, me);
		return true;
	},

	onCancelEdit: function (editor, object) {
		var me = this,
			record = object.record;
		if (record && record.phantom) {
			me.store.remove(record);
		}
	},

	onAfterRefClick: function (field) {
		var me = this,
			ir = me.activeRecord.getLikeObject();
		me.refField = field;

		App.Req.async({
			actionUrl: field.actionUrl,
			params: {
				storeId        : me.storeId,
				record         : ir,
				field          : field.getName(),
				constrainField : field.constrainField,
				constrainLookup: field.constrainLookup,
				constrain      : me.getConstrain(field)
			},
			func : Common.EMan.onCreateWindow,
			inst : Common.EMan,

			// События окна выбора в связанном наборе
			extra : {
				items: [
					{
						name  : 'gridview',
						events: {
							selectrecords: {
								fn   : me.onAfterRefSelect,
								scope: me
							}
						}
					}
				]
			}
		});
	},

	/**
	 * Для отсечения выбора уже существующих записей в НД, необходимо отправить их список
	 * и убрать их из набора на сервере.
	 */
	getConstrain: function (field) {
		var me = this,
			records,
			crecs = [];

		if (field.useConstrain) {
			records = me.store.getRange();
			records.forEach(function (item) {
				crecs.push(item.get(field.constrainField));
			}, me);

			records = me.store.getModifiedRecords();
			records.forEach(function (item) {
				crecs.push(item.get(field.constrainField));
			}, me);

			records = me.store.getRemovedRecords();
			records.forEach(function (item) {
				crecs.push(item.get(field.constrainField));
			}, me);
		}

		return crecs;
	},

	/**
	 * Метод обработки ответа сервера на добавление/копирование записи.
	 * @param record object
	 */
	onAfterNewRecord: function (record) {
		var me = this,
			newrec = me.store.add(record);
		me.getSelectionModel().select(newrec);
		me.acEditRecord();
	},

	acExportToExcel: function () {
		var me = this,
			records = [],
			range = me.store.getRange();

		for (var i = 0; i < range.length; i++) {
			records.push(range[i].getLikeObject());
		}

		App.Req.async({
			actionUrl: '/report/default/getfreereport',
			params   : {
				storeId: me.store.storeId,
				records: records
			},
			func     : me.onAfterGetReport,
			inst     : me
		});
	},

	/**
	 * Метод обработки выбора записи в связанном наборе.
	 * @param records array Массив выбранных записей
	 */
	onAfterRefSelect: function (records) {
		var me = this;

		App.Req.async({
			actionUrl: '/encore/dataset/refchoice',
			params: {
				storeId  : me.storeId,
				selection: records,
				field    : me.refField.getName(),
				record   : me.activeRecord.getLikeObject()
			},
			func: me.doAfterRefChoice,
			inst: me
		});
	},

	/**
	 * Применение изменений к записям после выбора в связанном наборе данных.
	 * @param records array Массив обработанных записей
	 */
	doAfterRefChoice: function (records) {
		var me = this, i, record;

		if (records.length === 1) {
			// Выбор одной записи
			me.refField.setValue(records[0][me.refField.getName()]);
			rec = me.store.findRecord(me.activeRecord.idProperty, me.activeRecord.get(me.activeRecord.idProperty));
			rec.set(records[0]);
			me.activeRecord = rec;
			// Завершаем работу редактора конфигурации
			me.getPlugin('gridEdt').completeEdit();
		}
		else if (records.length > 1) {
			// Множественный выбор
			me.getPlugin('gridEdt').cancelEdit();
			for (i = 0; i < records.length; i++) {
				me.onAfterNewRecord(records[i]);
			}
		}
	},

	onAfterSyncRecords: function (batch, options) {
		var me = this;
		me.fireEvent('aftersync', me, batch, options);
	},

	onAfterSuccessSync: function (batch, options) {
		var me = this;
		me.doneSync = true;
		me.fireEvent('aftersuccesssync', me, batch, options);
	},

	onFailureSync: function (batch, options) {
		var me = this;
		Ext.each(batch.exceptions, function (item) {
			App.Msg.showTip(item.error, Ext.Msg.ERROR);
		}, me);
		me.fireEvent('afterfailuresync', me, batch, options);
	},

	/**
	 *  Обработчики кнопок gridview
	 */

	acRefresh: function () {
		this.store.load();
	},

	acNew: function () {
		this.getNewRecord();
	},

	acNewAsCopy: function () {
		var me = this;
		if (me.activeRecord) {
			me.getNewRecord(me.activeRecord.getLikeObject());
		}
	},

	getNewRecord: function (record) {
		var me = this;
		App.Req.async({
			actionUrl: '/encore/dataset/newrecord',
			params: {
				storeId: me.store.storeId,
				record : record || {}
			},
			sync: false,
			func: me.onAfterNewRecord,
			inst: me
		});
	},

	acEditRecord: function () {
		var me = this;
		if (me.activeRecord) {
			me.getPlugin('gridEdt').startEdit(me.activeRecord, me.headerCt.getVisibleHeaderClosestToIndex(0));
		}
	},

	acCommit: function () {
		var me = this;
		me.store.sync({
			callback: me.onAfterSyncRecords,
			success : me.onAfterSuccessSync,
			failure : me.onFailureSync,
			scope   : me
		});
	},

	acRollback: function () {
		var me = this;
		me.store.undo();
		me.fireEvent('rollback', me);
	},

	acDelete: function () {
		var me = this;
		if (me.activeRecord) {
			me.store.remove(me.activeRecord);
		}
	},

	acDeleteAll: function () {
		this.store.removeAll();
	},

	acSelect: function () {
		var me = this,
			selection = [],
			selmodel = me.getSelectionModel(),
			choice, i = 0;

		choice = selmodel.getSelection();
		for (; i < choice.length; i++) {
			selection.push(choice[i].getLikeObject());
		}

		me.fireEvent('selectrecords', selection);
		me.cmpWin.acExit();
	},

	acSelectNull: function () {
		this.fireEvent('selectrecords', []);
		this.cmpWin.acExit();
	},

	acSelectPlular: function (btn, pressed) {
		var me = this;
		me.isPlular = pressed;
	},

	acGridRowsCount: function () {
		App.Msg.Information('Количество строк: ' + this.store.getRange().length);
	},

	acToggleFilter: function (btn, checked) {
		this.filters.clearFilters();
	},

	/**
	 * Методы поиска записей в наборе данных
	 */

	/**
	 * Поиск записи по нескольким полям, указанным в настройках набора данных.
	 * @var value string
	 * @var start integer
	 * @return Ext.model.Model|boolean
 	 */
	doFindRecord: function(value, start) {
		var me = this,
			store = me.getStore(),
			record = false,
			i = 0,
			searched = [];

		for (; i < me.quickSearch.length; i++) {
			record = store.findRecord(me.quickSearch[i], value, start, true);
			if (record) {
				searched.push(record);
			}
		}

		if (searched.length > 0) {
			record = Ext.Array.min(searched, function(min, item) {
				var minindex = store.indexOf(min),
					index = store.indexOf(item);
				if (index === minindex) {
					return 0;
				}
				else if (index > minindex) {
					return -1;
				}
				else {
					return 1
				}
			});
			return record;
		}
		else {
			return false;
		}
	},

	onChangeSearch: function (grid, newValue, oldValue) {
		this.gridtoolbar.items.getByKey('i_down_search').setDisabled(newValue.length === 0);
		this.gridtoolbar.items.getByKey('i_clear_search').setDisabled(newValue.length === 0);
	},

	acSearchDown: function (btn) {
		var me = this,
			value = me.gridtoolbar.items.getByKey('i_search').getValue(),
			store,
			record,
			start;

		if (value.length > 0) {
			store = me.getStore();
			start = (me.activeRecord) ? store.indexOf(me.activeRecord) : 0;
			record = me.doFindRecord(value, start + 1);

			if (record) {
				me.getSelectionModel().select(record);
			}
			else {
				if (btn) {
					Ext.Msg.show({
						title:'Поиск: ' + value,
						msg: 'Поиск значения ' + value + ' завершен. Начать с начала таблицы?',
						buttons: Ext.Msg.YESNOCANCEL,
						icon: Ext.Msg.QUESTION,
						fn: function(buttonId) {
							if (buttonId === 'yes') {
								me.getSelectionModel().select(store.first());
								me.acSearchDown();
							}
						}
					});
				}
				else {
					Ext.Msg.show({
						title:'Поиск: ' + value,
						msg: 'Поиск значения ' + value + ' завершен. Значение не найдено.',
						buttons: Ext.Msg.YES,
						icon: Ext.Msg.QUESTION
					});
				}
			}
		}
	},

	acClearSearch: function () {
		this.gridtoolbar.items.getByKey('i_search').setValue('');
	},

	destroy: function () {
		var me = this;
		delete me.activeRecord;
		delete me.selection;
		delete me.cmpWin;

		// Удаление store
		App.Req.async({
			module    : 'encore',
			controller: 'dataset',
			action    : 'closedataset',
			params    : {
				storeId: me.store.storeId,
				stores : [me.store.storeId]
			}
		});

		me.callParent();
	}

});
