<?php
/**
 * Description of EnGridView
 * Обязательные поля:
 *        itemId - Локальный идентификатор компонента, он необходим для установки
 *                свойства окну с таким названием.
 *        storeId - Идентификатор датакласса, т.к. по нему привязывается store
 *        columns - Массив колонок
 *
 * @author Ilya Petrushenko
 * @version 0.1
 * @since 23.04.2013
 */

class EnGridView extends ExtGrid
{
	/**
	 * Массив выбранных записей. Используется только в ExtJs.
	 * @var array
	 */
	protected $selection;

	/**
	 * Идентификатор стартовой записи
	 * @var integer
	 */
	public $startRecord;

	/**
	 * Идентификатор набора данных
	 * @var string
	 */
	public $storeId;

	/**
	 * Отображение кнопок
	 * @var integer
	 */
	public $viewOptions;

	/**
	 * Наличие множественного выбора
	 * @var boolean
	 */
	public $isPlular;

	/**
	 * Массив настроек viewConfig->getRowClass array(field=>'', value=>'', cls=>'')
	 * @var array
	 */
	public $rowOptions;

	/**
	 * Название модуля для открытия связанного набора данных.
	 * @var string
	 */
	public $module;

	/**
	 * Название контроллера для открытия связанного набора данных.
	 * @var string
	 */
	public $controller;

	/**
	 * Название действия для открытия связанного набора данных.
	 * @var string
	 */
	public $action;

	/**
	 * Ограничения на выбор записей
	 * @var integer
	 */
	public $selectConstrain;

	/**
	 * Список полей набора по которым производить быстрый поиск записей
	 * @var array|bool
	 */
	public $quickSearch;

	/**
	 * Список функций, которые необходимо добавить к объекту
	 * @var
	 */
//	public $actions;

	public function initComponent()
	{
		parent::initComponent();
		$this->cmpClass = 'Common.grid.TenGridView';
		$this->xtype    = 'engridview';
		$this->createToolbars();

		$this->selection = array();
		$this->isPlular  = FALSE;

		if ($this->viewOptions & U_CHANGE)
			$this->plugins->add(new ExtRowEditing(array(
				'pluginId'           => 'gridEdt',
				'clicksToEdit'       => 2,
				'clicksToMoveEditor' => 1,
				'saveBtnText'        => 'Сохранить',
				'cancelBtnText'      => 'Отменить',
				'errorSummary'       => FALSE
			)));

		$this->emptyText = 'Записи отсутствуют';
	}

	protected function getCanModify()
	{
		return $this->viewOptions & (U_INSERT | U_UPDATE | U_DELETE);
	}

	protected function createToolbars()
	{
		$items = array(
			array(
				'iconCls' => 'i_refresh',
				'itemId'  => 'i_refresh',
				'tooltip' => 'Обновить',
				'handler' => 'acRefresh'
			)
		);

		if ($this->getExistFilters())
		{
			$items[] = array(
				'iconCls' => 'i_clear_filter',
				'itemId'  => 'i_clear_filter',
				'tooltip' => 'Выключить все фильтры',
				'handler' => 'acToggleFilter',
			);
		}

		if ($this->getCanModify())
		{
			$items[] = array(
				'xtype' => 'tbspacer',
				'width' => 30
			);

			if ($this->viewOptions & U_UPDATE)
			{
				$items[] = array(
					'iconCls' => 'i_edit',
					'itemId'  => 'i_edit',
					'tooltip' => 'Редактировать запись',
					'handler' => 'acEditRecord'
				);
			};

			// Кнопки добавление записей
			if ($this->viewOptions & U_INSERT)
			{
				$items[] = array(
					'iconCls' => 'i_add',
					'itemId'  => 'i_add',
					'tooltip' => 'Новая запись',
					'handler' => 'acNew'
				);

				$items[] = array(
					'iconCls' => 'i_add_copy',
					'itemId'  => 'i_add_copy',
					'tooltip' => 'Создать копию записи',
					'handler' => 'acNewAsCopy'
				);
			};

			// Кнопки удаления записей
			if ($this->viewOptions & U_DELETE)
			{
				$items[] = array(
					'xtype' => 'tbspacer',
					'width' => 30
				);

				$items[] = array(
					'iconCls' => 'i_delete',
					'itemId'  => 'i_delete',
					'tooltip' => 'Удалить запись',
					'handler' => 'acDelete'
				);

				$items[] = array(
					'iconCls' => 'i_delete_all',
					'itemId'  => 'i_delete_all',
					'tooltip' => 'Удалить все записи',
					'handler' => 'acDeleteAll'
				);
			};

			$items[] = array(
				'xtype' => 'tbspacer',
				'width' => 30
			);

			$items[] = array(
				'iconCls' => 'i_save',
				'itemId'  => 'i_save',
				'tooltip' => 'Сохранить изменения',
				'handler' => 'acCommit'
			);

			$items[] = array(
				'iconCls' => 'i_undo',
				'itemId'  => 'i_undo',
				'tooltip' => 'Отменить изменения',
				'handler' => 'acRollback'
			);
		};

		$items[] = array(
			'xtype' => 'tbspacer',
			'width' => 30
		);

		if ($this->viewOptions & U_EXCEL)
			$items[] = array(
				'iconCls' => 'i_excel',
				'itemId'  => 'i_excel',
				'tooltip' => 'Экспорт в Excel',
				'handler' => 'acExportToExcel'
			);

		if ($this->viewOptions & U_ROWS)
			$items[] = array(
				'iconCls' => 'i_row_count',
				'itemId'  => 'i_row_count',
				'tooltip' => 'Количество строк',
				'handler' => 'acGridRowsCount'
			);

		// Кнопки осуществления выбора записей
		if ($this->viewOptions & U_SELECT)
		{
			$items[] = array(
				'xtype' => 'tbspacer',
				'width' => 30
			);

			$items[] = array(
				'iconCls' => 'i_one_select',
				'itemId'  => 'i_one_select',
				'tooltip' => 'Выход с выбором',
				'handler' => 'acSelect',
			);

			$items[] = array(
				'iconCls' => 'i_null_select',
				'itemId'  => 'i_null_select',
				'tooltip' => 'Выход с "пустым" значением',
				'handler' => 'acSelectNull',
			);
		};

		// Кнопка множественного выбора
		if ($this->viewOptions & U_MULTI_SELECT)
		{
			$items[] = array(
				'iconCls'       => 'i_many_select',
				'itemId'        => 'i_many_select',
				'tooltip'       => 'Множественный выбор',
				'enableToggle'  => TRUE,
				'toggleHandler' => 'acSelectPlular',
				'toggleGroup'   => 'many-select',
				'pressed'       => TRUE
			);

			$this->selModel = array('mode' => 'MULTI');
			$this->isPlular = TRUE;
		}

		$this->tbar = new ExtToolbar(array(
			'xtype'    => 'toolbar',
			'itemId'   => 'gridtoolbar',
			'defaults' => array(
				'xtype' => 'button'
			),
			'items'    => $items
		));

		$this->suspendProps[] = 'tbar';
	}

	public function setTbar($value)
	{
		parent::setTbar($value);
		if (is_null($this->tbar))
			$this->suspendProps = array();
	}

	public function getSelection()
	{
		return $this->selection;
	}

	public function excludePrivs($privs)
	{
		if ($privs & U_UPDATE)
			$this->tbar->removeByItemId('i_edit');

		if ($privs & U_INSERT)
		{
			$this->tbar->removeByItemId('i_add');
			$this->tbar->removeByItemId('i_add_copy');
		};

		if ($privs & U_DELETE)
		{
			$this->tbar->removeByItemId('i_delete');
			$this->tbar->removeByItemId('i_delete_all');
		};

		if ($privs & U_EXCEL)
			$this->tbar->removeByItemId('i_excel');

		if ($privs & U_ROWS)
			$this->tbar->removeByItemId('i_row_count');

		if ($privs & U_SELECT)
		{
			$this->tbar->removeByItemId('i_one_select');
			$this->tbar->removeByItemId('i_null_select');
		};

		if ($privs & U_MULTI_SELECT)
			$this->tbar->removeByItemId('i_many_select');
	}

}
