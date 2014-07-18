<?php
/**
 * Description of EnSchemaWindow
 * Класс окна с отображением дерева планирования.
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @version 0.1
 * @since 11.07.2013
 */

class EnTreePanel extends ExtTreePanel
{
	/**
	 * Набора данных combobox
	 * @var EnSimpleDataset
	 */
	public $comboStore;

	/**
	 * Идентификатор набора данных
	 * @var string
	 */
	public $storeId;

	/**
	 * Идентификатор набора данных combobox
	 * @var string
	 */
	public $comboStoreId;

	/**
	 * Название набора данных combobox
	 * @var string
	 */
	public $spgName;

	/**
	 * Отображение кнопок управления деревом
	 * @var integer
	 */
	public $viewOptions;

	/**
	 * Url открытия окна групп суммарных показателей
	 * @var string
	 */
	public $groupUrl;

	/**
	 * Url предоставления доступа к группе суммарных показателей
	 * @var string
	 */
	public $groupPrivsUrl;

	/**
	 * Url открытия окна состава суммарного показателя
	 * @var string
	 */
	public $groupSostavUrl;

	public function initComponent()
	{
		parent::initComponent();
		$this->_notExt[] = 'comboStore';
		$this->_notExt[] = 'spgName';
		$this->cmpClass  = 'Common.panel.TenTreePanel';
		$this->xtype     = 'entreepanel';

		if (is_null($this->viewOptions))
			$this->viewOptions = 0;

		$this->createToolbar();
	}

	protected function createToolbar()
	{
		$this->comboStore   = Yii::app()->enStore->createDs($this->spgName);
		$this->comboStoreId = $this->comboStore->dataset->uid;

		$tItems = array(
			array(
				'iconCls' => 'i_refresh',
				'itemId'  => 'i_refresh',
				'tooltip' => 'Обновить',
				'handler' => 'acRefresh'
			),
			array('xtype' => 'tbspacer', 'width' => 20),

			array(
				'xtype'         => 'combobox',
				'itemId'        => 'i_combo_gr',
				'store'         => $this->comboStoreId,
				'valueField'    => 'ID_SREZ',
				'displayField'  => 'IDNAME',
				'triggerAction' => 'all',
				'allowBlank'    => FALSE,
				'labelAlign'    => 'left',
				'labelWidth'    => 65,
				'fieldLabel'    => 'Группы СП',
				'emptyText'     => 'Нет группы',
				'width'         => 250,
				'editable'      => FALSE
			)
		);

		if ($this->viewOptions && U_CRUD)
		{
			$tItems[] = array(
				'iconCls' => 'i_sostav',
				'itemId'  => 'i_groups',
				'tooltip' => 'Группы суммарных показателей',
				'handler' => 'acGroups',
				'endata'  => array('actionUrl' => $this->groupUrl)
			);

			$tItems[] = array(
				'iconCls' => 'i_privs',
				'itemId'  => 'i_group_priv',
				'tooltip' => 'Доступ к суммарному показателю',
				'handler' => 'acGroupPriv',
				'endata'  => array('actionUrl' => $this->groupPrivsUrl)
			);
		}

		$this->suspendProps[] = 'tbar';
		$this->tbar           = new ExtToolbar(array(
			'xtype'    => 'toolbar',
			'itemId'   => 'ttreebar',
			'defaults' => array('xtype' => 'button'),
			'items'    => $tItems
		));

		if ($this->viewOptions && U_CRUD)
		{
			$this->suspendProps[] = 'fbar';
			$this->fbar           = new ExtToolbar(array(
				'xtype'    => 'toolbar',
				'itemId'   => 'ftreebar',
				'defaults' => array(
					'xtype' => 'button'
				),
				'items'    => array(
					array(
						'iconCls' => 'i_sostav',
						'itemId'  => 'i_sp_sostav',
						'tooltip' => 'Состав СП',
						'handler' => 'acSostavSp',
						'endata'  => array('actionUrl' => $this->groupSostavUrl)
					),

//					array(
//						'iconCls'  => 'i_delete',
//						'itemId'   => 'i_deactivate',
//						'tooltip'  => 'Отключить СП',
//						'handler'  => 'acDeactivate',
//						'disabled' => TRUE
//					),
//					array(
//						'iconCls'  => 'i_recalc',
//						'itemId'   => 'i_recalc',
//						'tooltip'  => 'Перерасчёт',
//						'handler'  => 'acPereraschet',
//						'disabled' => TRUE
//					)
				)
			));
		}

	}

}
