<?php
/**
 * Description of ExtRefUniversal
 * Класс окна справочника.
 *
 * @author Ilya Petrushenko <ilya.petrushenko@yandex.ru>
 * @version 0.1
 * @since 22.03.2013
 */

class EnRefUniversal extends EnUniversal
{
	/**
	 * Дополнительные настройки грида
	 * Чтобы не устанавливать после создания окна
	 * Грид создаётся с классом viewClass, если нету то с основным EnGridView,
	 * Остальные параметры устанавливаются после создания грида.
	 * @var array
	 */
	public $viewConfig = 'EnGridView';

	/**
	 * Набор данных
	 * @var EnSimpleDataset
	 */
	protected $store;

	/**
	 * Грид
	 * @var EnGridView
	 */
	protected $view;

	/**
	 * Список url для доступа к различным методам контроллеров
	 * @var array
	 */
	protected $links;

	/**
	 * Права на действия над набором данных.
	 * Требуют установки, когда окно создается из refExec.
	 * @var integer
	 */
	public $viewOptions;

	/**
	 * Режим добавления панели для выбора периода
	 * @var integer
	 */
	public $periodMode;

	/**
	 * Добавление кнопки для вывода отчета Excel
	 * @var boolean
	 */
	public $withExcel;

	public function initComponent()
	{
		parent::initComponent();
		$this->_notExt[] = 'store';
		$this->_notExt[] = 'view';
		$this->_notExt[] = 'viewClass';
		$this->_notExt[] = 'viewConfig';
		$this->cmpClass  = 'Common.wins.winRefUniversal';
		$this->xtype     = 'winrefuniversal';
		if (is_null($this->periodMode))
			$this->periodMode = PM_NONE;
		$this->createToolbar();
		$this->createItems();

		// default
		Ext::applyIf($this, array(
			'title'      => $this->store->classCaption,
			'maximized'  => TRUE,
			'width'      => 400,
			'height'     => 400,
		));
	}

	/**
	 * @virtual
	 * Метод создания панели кнопок окна.
	 */
	protected function createToolbar()
	{
		$this->suspendProps[] = 'tbar';

		$config = array(
			'xtype'    => 'toolbar',
			'itemId'   => 'wintoolbar',
			'defaults' => array('xtype' => 'button'),
			'items'    => array(
				array('xtype' => 'tbfill'),
				array(
					'iconCls' => 'i_exit',
					'itemId'  => 'i_exit',
					'tooltip' => 'Выход',
					'handler' => 'acExit'
				)
			)
		);

		$this->tbar = new ExtToolbar($config);

		if ($this->periodMode !== PM_NONE)
		{
			$this->tbar->insertGroup(array(
				array(
					'xtype' => 'tbtext',
					'text'  => '<strong>Период:</strong> с'
				),

				array(
					'xtype'  => 'tbtext',
					'itemId' => 'i_beg_date',
					'text'   => YTime::today(TRUE, 'd.m.Y')
				),

				array(
					'xtype' => 'tbtext',
					'text'  => 'по'
				),

				array(
					'xtype'  => 'tbtext',
					'itemId' => 'i_end_date',
					'text'   => YTime::today(TRUE, 'd.m.Y')
				),

				array(
					'iconCls' => 'i_period',
					'itemId'  => 'i_period',
					'tooltip' => 'Выбор периода',
					'handler' => 'acChoicePeriod'
				),
			));
		};

		if ($this->withExcel)
		{
			$this->tbar->insertGroup(array(
				array(
					'xtype' => 'tbspacer',
					'width' => 50
				),
				array(
					'iconCls' => 'i_excel',
					'itemId'  => 'i_excel',
					'tooltip' => 'Сформировать отчёт',
					'handler' => 'acCreateReport',
					'disabled' => TRUE
				)
			), 5);
		};
	}

	/**
	 * @virtual
	 * Метод создания компонентов окна.
	 */
	protected function createItems()
	{
		if (is_array($this->viewConfig) && count($this->viewConfig) > 0)
		{
			if (array_key_exists('viewClass', $this->viewConfig))
			{
				$vclass = $this->viewConfig['viewClass'];
				unset($this->viewConfig['viewClass']);
			}
			else
				$vclass = 'EnGridView';
		}
		else if (is_string($this->viewConfig) && strlen($this->viewConfig) > 0 && class_exists($this->viewConfig))
			$vclass = $this->viewConfig;
		else
			$vclass = 'EnGridView';

		$this->view = new $vclass(array(
			'itemId'      => 'gridview',
			'margin'      => '5',
			'storeId'     => $this->store->dataset->uid,
			'columns'     => $this->store->getColumns(),
			'viewOptions' => $this->viewOptions | U_EXCEL | U_ROWS
		));

		if (is_array($this->viewConfig) && count($this->viewConfig) > 0)
		{
			foreach ($this->viewConfig as $prop => $value)
				$this->view->$prop = $value;
		}

		if ($this->store->usePagination)
		{
			$this->view->xtype    = 'enpageview';
			$this->view->cmpClass = 'Common.grid.TenPaginationView';
		}

		// Настройки быстрого поиска записей
		$this->view->quickSearch = $this->store->quickSearch;

		$this->add($this->view);
	}

	/**
	 * @inherit docs
	 */
	protected function beforeGetExtJs()
	{
		parent::beforeGetExtJs();
		if ($this->modal === FALSE)
		{
			// Настройки окна
			$config = Yii::app()->enApp->getXmlOptions('frm' . $this->store->getClassName());

			if (strlen($config) > 0 && simplexml_load_string($config))
			{
				// @todo: Сделать загрузку настроек окна
			}
			else
			{
				$this->width  = 600;
				$this->height = 300;
			}
			$this->maximized = TRUE;
		}
		else
		{
			$this->width  = 600;
			$this->height = 300;
		}
	}

	public function setStore(EnLocaleDataset $value)
	{
		$this->store = $value;

		if ($this->store->canModify)
		{
			$this->viewOptions |= U_READ;
			$this->viewOptions |= U_INSERT;
			$this->viewOptions |= U_UPDATE;
			$this->viewOptions |= U_DELETE;
		}

		$this->addStore($this->store->getExtStore('dataset'));
		$this->addModel($this->store->getExtModel());
	}

	public function getStore()
	{
		return $this->store;
	}

	public function getView()
	{
		return $this->view;
	}

	public function addLink($name, $route)
	{
		if (!is_array($this->links))
			$this->links = array();

		$this->links[strtolower($name)] = $route;
	}

	public function getLinks()
	{
		return $this->links;
	}

	public function setLinks(array $value)
	{
		$this->links = $value;
	}
}
