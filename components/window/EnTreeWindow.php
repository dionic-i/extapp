<?php
/**
 * Description of EnPlanWindow
 * Класс окна с отображением дерева планирования.
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @version 0.1
 * @since 11.07.2013
 */

class EnTreeWindow extends EnUniversal
{
	/**
	 * Набор данных дерева связей объектов
	 * @var TenTreeDataset
	 */
	protected $store;

	/**
	 * Дополнительная конфигурация панели tree
	 * @var array
	 */
	public $treeConfig = array();

	/**
	 * Форма с combobox для выбора группы суммарных показателей
	 * @var EnTreePanel
	 */
	public $tree;

	/**
	 * Название набора данных списка ИВКЭ
	 * @var string
	 */
	public $spgName;

	/**
	 * Права на набор дерева объектов
	 * @var integer
	 */
	public $treeViewOptions;

	public function initComponent()
	{
		parent::initComponent();
		$this->_notExt[] = 'store';
		$this->_notExt[] = 'tree';
		$this->_notExt[] = 'treeConfig';
		$this->cmpClass  = 'Eres.wins.winTree';
		$this->xtype     = 'wintree';
		$this->createToolbar();
		$this->createItems();
		$this->title = $this->store->classCaption;
	}

	/**
	 * Метод создания панели кнопок управления при возвращении конфгурационного объекта ExtJs.
	 * @return ExtToolbar
	 */
	protected function createToolbar()
	{
		$this->suspendProps[] = 'tbar';
		$this->tbar           = new ExtToolbar(array(
			'xtype'    => 'toolbar',
			'itemId'   => 'wintoolbar',
			'defaults' => array('xtype' => 'button'),
			'items'    => array(

				array(
					'xtype'      => 'datefield',
					'fieldLabel' => 'Выбор даты',
					'labelWidth' => 70,
					'width'      => 200,
					'itemId'     => 'i_date',
					'format'     => 'Y-m-d',
					'value'      => YTime::now(TRUE, 'Y-m-d'),
					'editable'   => FALSE,
					'allowBlank' => FALSE,
					'margin'     => '0 0 0 5'
				),

				array('xtype' => 'tbfill'),

				array(
					'iconCls' => 'i_exit',
					'itemId'  => 'i_exit',
					'tooltip' => 'Выход',
					'handler' => 'acExit'
				)
			)
		));
	}

	protected function createItems()
	{
		$config     = CMap::mergeArray(
			$this->treeConfig,
			array(
				'itemId'              => 'treeview',
				'margin'              => '5',
				'storeId'             => $this->store->dataset->uid,
				'columns'             => $this->store->getColumns(),
				'rootVisible'         => FALSE,
				'defaultRootProperty' => 'data',
				'flex'                => 2,
				'spgName'             => $this->spgName,
			)
		);
		$this->tree = new EnTreePanel($config);
		$this->addStore($this->tree->comboStore->getExtStore('comboDataset'));
		$this->addModel($this->tree->comboStore->getExtModel());
		$this->add($this->tree);
	}

	public function setStore(EnLocaleDataset $value)
	{
		$this->store  = $value;
		$ds           = $this->store->getExtStore('treeDataset');
		$ds->cmpClass = 'Common.data.TenTreeStore';
		$this->addStore($ds);
		$this->addModel($this->store->getExtModel());
	}

	public function getStore()
	{
		return $this->store;
	}
}
